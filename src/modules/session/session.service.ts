import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../libs/services/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ArgonService } from '../../libs/services/argon.service';
import { ISession } from './session';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { EJwtTokenTypes } from '../../libs/utils/enum';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { getBlackListTokenKey } from '../../libs/helpers/helper';

@Injectable()
export class SessionService implements ISession {
  private readonly logger: Logger = new Logger(SessionService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly argon2: ArgonService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async createSession(
    deviceUUID: string,
    accessTokenUUID: string,
    refreshToken: string,
    userUUID: string,
  ): Promise<void> {
    const sessions = await this.prisma.session.findMany({
      where: { userUUID },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (
      sessions.length < parseInt(this.configService.get('USER_SESSION_LIMIT'))
    ) {
      await this.createNewSession(
        deviceUUID,
        accessTokenUUID,
        refreshToken,
        userUUID,
      );
      this.logger.debug(
        `Session limit not reached, new session created for user: ${userUUID}`,
      );

      return;
    }

    this.logger.debug(
      `Session limit  reached, need to delete oldest session for user: ${userUUID}`,
    );

    await this.deleteSession(sessions[0].deviceUUID);

    await this.createNewSession(
      deviceUUID,
      accessTokenUUID,
      refreshToken,
      userUUID,
    );

    this.logger.debug(
      `Oldest session deleted  and new session created for user: ${userUUID}`,
    );

    return;
  }

  async createNewSession(
    deviceUUID: string,
    accessTokenUUID: string,
    refreshToken: string,
    userUUID: string,
  ): Promise<void> {
    const { accessExpiredAt, refreshExpiredAt } = this.getPairExpirationDates();

    const hashedRefreshToken = await this.getHashedRefreshToken(refreshToken);

    await this.prisma.session.create({
      data: {
        deviceUUID,
        refreshToken: hashedRefreshToken,
        userUUID,
        expiredAt: refreshExpiredAt,
        sessionAccessToken: {
          create: {
            accessTokenUUID,
            expiredAt: accessExpiredAt,
          },
        },
      },
    });
  }

  private async getHashedRefreshToken(refreshToken: string): Promise<string> {
    return this.argon2.hash(refreshToken);
  }

  private getPairExpirationDates(): {
    accessExpiredAt: Date;
    refreshExpiredAt: Date;
  } {
    const currentTime = new Date();

    const accessExpiredAt = new Date(
      currentTime.getTime() +
        parseInt(this.configService.get('ACCESS_TOKEN_LIFE_TIME')) * 1000,
    );
    const refreshExpiredAt = new Date(
      currentTime.getTime() +
        parseInt(this.configService.get('REFRESH_TOKEN_LIFE_TIME')) * 1000,
    );

    return { accessExpiredAt, refreshExpiredAt };
  }

  async deleteSession(deviceUUID: string): Promise<{ success: boolean }> {
    const session = await this.prisma.session.delete({
      where: { deviceUUID },
      select: {
        sessionAccessToken: true,
      },
    });

    await Promise.all([
      this.blackListToken(
        session?.sessionAccessToken.accessTokenUUID,
        EJwtTokenTypes.ACCESS_TOKEN,
      ),
      this.blackListToken(
        session?.sessionAccessToken.accessTokenUUID,
        EJwtTokenTypes.REFRESH_TOKEN,
      ),
    ]);

    return { success: true };
  }

  async updateSession(
    refreshToken: string,
    deviceUUID: string,
    userUUID: string,
    accessTokenUUID: string,
    oldAccessToken: string,
  ): Promise<void> {
    await this.blackListToken(oldAccessToken, EJwtTokenTypes.REFRESH_TOKEN);

    const { accessExpiredAt, refreshExpiredAt } = this.getPairExpirationDates();

    const hashedRefreshToken = await this.getHashedRefreshToken(refreshToken);

    let session: { uuid: string };

    try {
      session = await this.prisma.session.update({
        where: { deviceUUID },
        data: {
          refreshToken: hashedRefreshToken,
          expiredAt: refreshExpiredAt,
        },
        select: {
          uuid: true,
        },
      });
    } catch (e: any) {
      this.logger.error(e.message);
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025')
        throw new UnauthorizedException(
          'auth.session_expired_or_invalid_refresh_token',
        );
    }

    this.logger.debug(`Session updated for device: ${deviceUUID}`);

    await this.prisma.sessionAccessToken.upsert({
      where: { sessionUUID: session.uuid },
      update: {
        accessTokenUUID,
        expiredAt: accessExpiredAt,
      },
      create: {
        accessTokenUUID,
        expiredAt: accessExpiredAt,
        sessionUUID: session.uuid,
      },
    });

    this.logger.debug(
      `New session access token created for device: ${deviceUUID}`,
    );
  }

  private async blackListToken(
    accessTokenUUID: string,
    type: EJwtTokenTypes,
  ): Promise<void> {
    this.redis.set(
      getBlackListTokenKey(accessTokenUUID, type),
      1,
      'EX',
      this.configService.get('ACCESS_TOKEN_LIFE_TIME'),
    );
  }
}
