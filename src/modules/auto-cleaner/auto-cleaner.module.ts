import { Module } from '@nestjs/common';
import { AutoCleanerService } from './auto-cleaner.service';
import { PrismaService } from '../../libs/services/prisma.service';

@Module({
  providers: [PrismaService, AutoCleanerService],
})
export class AutoCleanerModule {}
