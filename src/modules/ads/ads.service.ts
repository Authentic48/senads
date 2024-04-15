import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { PrismaService } from '../../libs/services/prisma.service';
import { IAds } from './ads';
import { AdQueryDto } from './dto/ad-query.dto';
import { RecommendedAdsDto } from './dto/recommended-ads.dto';
import { Prisma } from '@prisma/client';
import { IGetAd, IGetAds } from '../../libs/interfaces/ad.interface';

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
      isPriceNegotiable,
      conditions,
      features,
      year,
      brand,
      model,
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
        isPriceNegotiable,
        conditions,
        features,
        year,
        brand,
        model,
      },
    });
  }

  async findAllAds({
    subCategoryUUID,
    categoryUUID,
    regionID,
    cityID,
    offset,
    limit,
    profileUUID,
  }: AdQueryDto): Promise<[number, IGetAds[]]> {
    const query: Prisma.AdsFindManyArgs = {
      where: {
        subCategoryUUID,
        subCategory: {
          category: {
            uuid: categoryUUID,
          },
        },
        city: {
          id: cityID,
          regionID,
        },
        profileUUID,
      },
      take: limit,
      skip: offset,
      select: {
        uuid: true,
        title: true,
        price: true,
        images: true,
        subCategoryUUID: true,
        subCategory: {
          select: {
            category: true,
          },
        },
        city: {
          select: {
            region: true,
          },
        },
      },
    };

    return this.prisma.$transaction([
      this.prisma.ads.count({ where: query.where }),
      this.prisma.ads.findMany(query),
    ]);
  }

  async findAdByUUID(uuid: string): Promise<IGetAd> {
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
        isPriceNegotiable: true,
        year: true,
        features: true,
        status: true,
        conditions: true,
        brand: true,
        model: true,
        profile: {
          include: {
            profileSocialMedia: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
        city: {
          select: {
            title: true,
            region: true,
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
    {
      title,
      address,
      price,
      images,
      description,
      isPriceNegotiable,
      conditions,
      features,
      year,
      brand,
      model,
    }: UpdateAdDto,
    userUUID: string,
  ): Promise<void> {
    await this.checkAccess(uuid, userUUID);

    await this.prisma.ads.update({
      where: { uuid },
      data: {
        title,
        address,
        price,
        images,
        description,
        brand,
        conditions,
        isPriceNegotiable,
        features,
        year,
        model,
      },
    });
  }

  async removeAd(uuid: string, userUUID: string): Promise<void> {
    await this.checkAccess(uuid, userUUID);

    await this.prisma.ads.delete({
      where: { uuid },
    });
  }

  private async checkAccess(uuid: string, userUUID: string): Promise<void> {
    const ad = await this.findAdByUUID(uuid);

    if (ad.profileUUID != userUUID)
      throw new ForbiddenException('ads.forbidden');
  }

  async getRecommendedAds(
    uuid: string,
    { subCategoryUUID, categoryUUID }: RecommendedAdsDto,
  ): Promise<IGetAds[]> {
    return this.prisma.ads.findMany({
      where: {
        uuid: { not: uuid },
        subCategoryUUID,
        subCategory: {
          category: {
            uuid: categoryUUID,
          },
        },
      },
      take: 5,
      select: {
        uuid: true,
        title: true,
        price: true,
        images: true,
        subCategoryUUID: true,
        subCategory: {
          select: {
            category: true,
          },
        },
        city: {
          select: {
            title: true,
            region: true,
          },
        },
      },
    });
  }
}
