import { Module } from '@nestjs/common';
import { SubCategoriesService } from './sub-categories.service';
import { SubCategoriesController } from './sub-categories.controller';
import { PrismaService } from '../../libs/services/prisma.service';

@Module({
  controllers: [SubCategoriesController],
  providers: [SubCategoriesService, PrismaService],
})
export class SubCategoriesModule {}
