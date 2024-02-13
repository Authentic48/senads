import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../libs/services/prisma.service';

@Injectable()
export class AutoCleanerService {
  private readonly logger: Logger = new Logger(AutoCleanerService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async deleteExpiredSessionAndAccessToken() {
    const expiredSessionAccessTokens =
      this.prisma.sessionAccessToken.deleteMany({
        where: {
          expiredAt: {
            lte: new Date(),
          },
        },
      });

    const expiredSessions = this.prisma.session.deleteMany({
      where: {
        expiredAt: {
          lte: new Date(),
        },
      },
    });

    await this.prisma.$transaction([
      expiredSessionAccessTokens,
      expiredSessions,
    ]);

    this.logger.debug('Expired sessions and session access tokens deleted!!');
  }
}
