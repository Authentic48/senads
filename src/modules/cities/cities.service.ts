import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { PrismaService } from '../../libs/services/prisma.service';
import { IRegion } from '../../libs/interfaces/region.interface';
import { ICityService } from './city';

@Injectable()
export class CitiesService implements ICityService {
  constructor(private readonly prisma: PrismaService) {}
  async createCity(regionID: number, { title }: CreateCityDto): Promise<void> {
    await this.prisma.city.create({ data: { title, regionID } });
  }

  async findAllCities(regionID: number): Promise<IRegion[]> {
    return this.prisma.city.findMany({ where: { regionID } });
  }

  async findOneCity(id: number): Promise<IRegion> {
    const city = await this.prisma.city.findUnique({ where: { id } });

    if (!city) throw new NotFoundException('cities.not_found');

    return city;
  }

  async updateCity(id: number, { title }: UpdateCityDto): Promise<void> {
    await this.prisma.city.update({
      where: { id },
      data: {
        title,
      },
    });
  }

  async removeCity(id: number): Promise<void> {
    await this.prisma.city.delete({
      where: { id },
    });
  }
}
