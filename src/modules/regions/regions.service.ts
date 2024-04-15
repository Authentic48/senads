import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { PrismaService } from '../../libs/services/prisma.service';
import { IRegion } from '../../libs/interfaces/region.interface';
import { IRegionService } from './regions';

@Injectable()
export class RegionsService implements IRegionService {
  constructor(private readonly prisma: PrismaService) {}
  async createRegion({ title }: CreateRegionDto): Promise<void> {
    await this.prisma.region.create({ data: { title } });
  }

  async findAllRegions(): Promise<IRegion[]> {
    return this.prisma.region.findMany();
  }

  async findOneRegion(id: number): Promise<IRegion> {
    const region = await this.prisma.region.findUnique({ where: { id } });

    if (!region) throw new NotFoundException('regions.not_found');

    return region;
  }

  async updateRegion(id: number, { title }: UpdateRegionDto): Promise<void> {
    await this.prisma.region.update({
      where: { id },
      data: {
        title,
      },
    });
  }

  async removeRegion(id: number): Promise<void> {
    await this.prisma.region.delete({
      where: { id },
    });
  }
}
