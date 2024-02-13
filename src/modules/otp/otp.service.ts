import { Injectable } from '@nestjs/common';
import { IOtp } from './otp';
import { ConfigService } from '@nestjs/config';
import { generateOTP } from '../../libs/helpers/helper';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { MailerSmtpService } from '../../libs/services/mailer-smtp.service';

@Injectable()
export class OtpService implements IOtp {
  private readonly otpLifeTime: number;

  private readonly reSendOtpTime: number;

  private readonly defaultOtp: number;
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerSmtpService: MailerSmtpService,
    @InjectRedis() private readonly redis: Redis,
  ) {
    this.otpLifeTime = this.configService.get('OTP_LIFE_TIME');
    this.reSendOtpTime = this.configService.get('RESEND_OTP_LIFE_TIME');
    this.defaultOtp = parseInt(this.configService.get('DEFAULT_CODE'));
  }

  async saveAndSendOTP(email: string, code: number): Promise<void> {
    await this.saveOTP(email, code);
    await this.sendOTP(email, code);
  }

  async canGenerateOTP(email: string): Promise<boolean> {
    const lastOtpTimestamp = Number(await this.redis.ttl(email));
    if (!lastOtpTimestamp) return true;
    const timeDifference = this.otpLifeTime - lastOtpTimestamp;

    return timeDifference > this.reSendOtpTime;
  }

  async deleteOTP(email: string): Promise<void> {
    await this.redis.del(email);
  }

  generateOTP(): number {
    return generateOTP();
  }

  async saveOTP(email: string, code: number): Promise<void> {
    await this.redis.set(email, code, 'EX', this.otpLifeTime);
  }

  async sendOTP(email: string, code: number): Promise<void> {
    if (this.configService.get('NODE_ENV') === 'local') return;

    await this.mailerSmtpService.sendMail({
      to: email,
      template: 'send-otp',
      subject: 'Confirmation code',
      context: {
        code,
      },
    });
  }

  async verifyOTP(email: string, code: number): Promise<boolean> {
    if (
      this.configService.get('NODE_ENV') === 'local' &&
      code === this.defaultOtp
    ) {
      return true;
    }
    return Number(await this.redis.get(email)) === code;
  }
}
