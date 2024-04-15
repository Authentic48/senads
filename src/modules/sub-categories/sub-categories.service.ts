import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { PrismaService } from '../../libs/services/prisma.service';
import { ICategory } from '../../libs/interfaces/category.interface';
import { ISubCategoriesService } from './sub-categories';

@Injectable()
export class SubCategoriesService implements ISubCategoriesService {
  constructor(private readonly prisma: PrismaService) {}
  async createSubCategory(
    uuid: string,
    { name }: CreateSubCategoryDto,
  ): Promise<void> {
    await this.prisma.subCategory.create({
      data: { name, categoryUUID: uuid },
    });
  }

  async findAllSubCategories(categoryUUID: string): Promise<ICategory[]> {
    return this.prisma.subCategory.findMany({ where: { categoryUUID } });
  }

  async findOneSubCategory(uuid: string): Promise<ICategory> {
    const subCategory = await this.prisma.subCategory.findUnique({
      where: { uuid },
    });

    if (!subCategory) throw new NotFoundException('sub-categories.not_found');

    return subCategory;
  }

  async updateSubCategory(
    uuid: string,
    { name }: UpdateSubCategoryDto,
  ): Promise<void> {
    await this.prisma.subCategory.update({
      where: { uuid },
      data: {
        name,
      },
    });
  }

  async removeSubCategory(uuid: string): Promise<void> {
    await this.prisma.subCategory.delete({
      where: { uuid },
    });
  }
}
