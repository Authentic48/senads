import { Injectable, Logger } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { EJwtTokenTypes } from '../utils/enum';

@Injectable()
export class RedisService {
  private readonly logger: Logger = new Logger(RedisService.name);
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly configService: ConfigService,
  ) {}

  getTokenKey(userUUID: string, type: EJwtTokenTypes) {
    if (type != EJwtTokenTypes.ACCESS_TOKEN)
      return `verify-otp-token-${userUUID}`;
    return `access-token-${userUUID}`;
  }

  async set(userUUID: string, token: string, type: EJwtTokenTypes) {
    await this.redis.set(
      this.getTokenKey(userUUID, type),
      token,
      'EX',
      this.configService.get('ACCESS_TOKEN_LIFE_TIME'),
    );

    this.logger.debug(
      `Verify OTP access token key: ${this.getTokenKey(
        userUUID,
        type,
      )} added to Redis`,
    );
  }

  async delete(userUUID: string, type: EJwtTokenTypes) {
    await this.redis.del(this.getTokenKey(userUUID, type));

    this.logger.debug(
      `Verify OTP access token key: ${this.getTokenKey(
        userUUID,
        type,
      )} remove from Redis`,
    );
  }
}
