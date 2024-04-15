import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../../libs/services/prisma.service';
import { ICategory } from '../../libs/interfaces/category.interface';
import { ICategoryService } from './category';

@Injectable()
export class CategoriesService implements ICategoryService {
  constructor(private readonly prisma: PrismaService) {}
  async createCategory({ name }: CreateCategoryDto): Promise<void> {
    await this.prisma.category.create({ data: { name } });
  }

  async findAllCategories(): Promise<ICategory[]> {
    return this.prisma.category.findMany();
  }

  async findOneCategory(uuid: string): Promise<ICategory> {
    const category = await this.prisma.category.findUnique({ where: { uuid } });

    if (!category) throw new NotFoundException('categories.not_found');

    return category;
  }

  async updateCategory(
    uuid: string,
    { name }: UpdateCategoryDto,
  ): Promise<void> {
    await this.prisma.category.update({
      where: { uuid },
      data: {
        name,
      },
    });
  }

  async removeCategory(uuid: string): Promise<void> {
    await this.prisma.category.delete({
      where: { uuid },
    });
  }
}
