import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import SMTPConnection from 'nodemailer/lib/smtp-connection';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerSmtpService implements OnModuleInit {
  private readonly name: string;
  private readonly host: string;
  private readonly port: number;
  private readonly username: string;
  private readonly password: string;
  private readonly from: string;

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    this.name = this.configService.get('TRANSPORT_NAME');
    this.host = this.configService.get('MAIL_HOST');
    this.port = this.configService.get('MAIL_PORT');
    this.username = this.configService.get('MAIL_USERNAME');
    this.password = this.configService.get('MAIL_PASSWORD');
    this.from = this.configService.get('MAIL_FROM_ADDRESS');
  }

  async onModuleInit() {
    await this.addTransport({
      auth: { user: this.username, pass: this.password },
      host: this.host,
      port: this.port,
    });
    this.logger.debug('transport loaded');
  }
  private readonly logger = new Logger(MailerSmtpService.name);

  async sendMail(data: ISendMailOptions): Promise<void> {
    this.logger.warn(`Trying to send email:  ${data.to}`);

    await this.mailerService.sendMail({
      from: this.from,
      ...data,
      transporterName: this.name,
    });

    this.logger.warn(`Code sent successfully to:  ${data.to}`);
  }
  private async addTransport(smtpConfig: SMTPConnection.Options) {
    return this.mailerService.addTransporter(this.name, smtpConfig);
  }
}
