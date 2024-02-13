import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from '../../libs/services/prisma.service';
import { OtpModule } from '../otp/otp.module';
import { UserController } from './user.controller';

@Module({
  imports: [OtpModule],
  providers: [UserService, PrismaService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
