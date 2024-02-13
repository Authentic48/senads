import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { InternalJWTService } from '../jwt/jwt.service';
import { PrismaService } from '../../libs/services/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from '../../libs/config/jwt.config';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { SessionService } from '../session/session.service';
import { OtpService } from '../otp/otp.service';
import { RedisService } from '../../libs/services/redis.service';
import { MailerSmtpService } from '../../libs/services/mailer-smtp.service';
import { ArgonService } from '../../libs/services/argon.service';

@Module({
  imports: [JwtModule.registerAsync(getJwtConfig())],
  controllers: [AuthController],
  providers: [
    PrismaService,
    InternalJWTService,
    AuthService,
    UserService,
    SessionService,
    OtpService,
    RedisService,
    MailerSmtpService,
    ArgonService,
  ],
})
export class AuthModule {}
