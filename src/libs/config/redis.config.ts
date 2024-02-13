import { RedisModuleAsyncOptions } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const getRedisConfig = (): RedisModuleAsyncOptions => ({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    config: {
      db: configService.get('REDIS_MAIN_DB'),
      url: configService.get('REDIS_URL'),
    },
  }),
});
