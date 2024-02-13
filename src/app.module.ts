import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from './libs/config/schema.config';
import { UserModule } from './modules/user/user.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { getRedisConfig } from './libs/config/redis.config';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AuthModule } from './modules/auth/auth.module';
import { AuthMiddleware } from './libs/middlewares/auth.middleware';
import { InternalJwtModule } from './modules/jwt/jwt.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AutoCleanerModule } from './modules/auto-cleaner/auto-cleaner.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema: configSchema }),
    RedisModule.forRootAsync(getRedisConfig()),
    MailerModule.forRoot({
      transports: {},
      template: {
        dir: join(__dirname, './libs/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    ScheduleModule.forRoot(),
    InternalJwtModule,
    AuthModule,
    AutoCleanerModule,
    UserModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
