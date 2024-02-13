import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { IJWTPayload } from '../../libs/interfaces/user.interface';
import { EJwtTokenTypes } from '../../libs/utils/enum';
import { getBlackListTokenKey } from '../../libs/helpers/helper';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class InternalJWTService {
  constructor(
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async generateToken(payload: IJWTPayload, lifeTime: number) {
    return this.jwt.signAsync(payload, { expiresIn: lifeTime });
  }

  async generateTokenPair(
    payload: IJWTPayload,
    deviceUUID: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    deviceUUID: string;
    accessTokenUUID: string;
  }> {
    const accessTokenUUID = randomUUID();

    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken(
        {
          deviceUUID,
          accessTokenUUID,
          type: EJwtTokenTypes.ACCESS_TOKEN,
          ...payload,
        },
        parseInt(this.configService.get('ACCESS_TOKEN_LIFE_TIME')),
      ),
      this.generateToken(
        {
          deviceUUID,
          accessTokenUUID,
          type: EJwtTokenTypes.REFRESH_TOKEN,
          ...payload,
        },
        parseInt(this.configService.get('REFRESH_TOKEN_LIFE_TIME')),
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      deviceUUID,
      accessTokenUUID,
    };
  }

  async verifyToken(
    token: string,
    type: EJwtTokenTypes,
  ): Promise<{ payload?: IJWTPayload; isTokenValid: boolean }> {
    const payload: IJWTPayload = await this.jwt.verifyAsync<IJWTPayload>(
      token,
      {
        ignoreExpiration: false,
      },
    );

    if (!payload || payload.type !== type)
      return { isTokenValid: false, payload: null };

    if (await this.isTokenBlackListed(payload.accessTokenUUID, payload.type))
      return { isTokenValid: false, payload };

    return { payload, isTokenValid: true };
  }

  async isTokenBlackListed(
    accessTokenUUID: string,
    type: EJwtTokenTypes,
  ): Promise<boolean> {
    return !!(await this.redis.exists(
      getBlackListTokenKey(accessTokenUUID, type),
    ));
  }
}
