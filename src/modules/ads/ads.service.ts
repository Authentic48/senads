import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { PrismaService } from '../../libs/services/prisma.service';
import { IAds } from './ads';

@Injectable()
export class AdsService implements IAds {
  constructor(private readonly prisma: PrismaService) {}

  async createAd(
    {
      title,
      description,
      images,
      subCategoryUUID,
      address,
      price,
    }: CreateAdDto,
    userUUID: string,
  ): Promise<void> {
    await this.prisma.ads.create({
      data: {
        title,
        description,
        images,
        subCategoryUUID,
        address,
        price,
        profileUUID: userUUID,
      },
    });
  }

  async findAllAds(subCategoryUUID?: string) {
    return this.prisma.ads.findMany({
      where: {
        subCategoryUUID,
      },
      select: {
        uuid: true,
        title: true,
        description: true,
        address: true,
        price: true,
        images: true,
        createdAt: true,
        subCategoryUUID: true,
        subCategory: {
          select: {
            category: true,
          },
        },
      },
    });
  }

  async findAdByUUID(uuid: string) {
    const ad = await this.prisma.ads.findUnique({
      where: { uuid },
      select: {
        uuid: true,
        title: true,
        description: true,
        address: true,
        price: true,
        images: true,
        createdAt: true,
        subCategory: {
          select: {
            category: true,
          },
        },
        profileUUID: true,
      },
    });

    if (!ad) throw new NotFoundException('ads.not_found');

    return ad;
  }

  async updateAd(
    uuid: string,
    { title, address, price, images, description }: UpdateAdDto,
    userUUID: string,
  ): Promise<void> {
    const ad = await this.findAdByUUID(uuid);

    if (ad.profileUUID != userUUID)
      throw new ForbiddenException('ads.forbidden');

    await this.prisma.ads.update({
      where: { uuid },
      data: {
        title,
        address,
        price,
        images,
        description,
      },
    });
  }

  async removeAd(uuid: string, userUUID: string): Promise<void> {
    const ad = await this.findAdByUUID(uuid);

    if (ad.profileUUID != userUUID)
      throw new ForbiddenException('ads.forbidden');

    await this.prisma.ads.delete({
      where: { uuid },
    });
  }
}
