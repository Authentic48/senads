import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { MailerSmtpService } from '../../libs/services/mailer-smtp.service';

@Module({
  providers: [OtpService, MailerSmtpService],
  exports: [OtpService],
})
export class OtpModule {}
