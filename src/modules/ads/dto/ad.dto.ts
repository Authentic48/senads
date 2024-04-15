import { ApiProperty } from '@nestjs/swagger';
import { IGetAd } from '../../../libs/interfaces/ad.interface';
import { ECondition } from '@prisma/client';
import { PublicProfileDto } from '../../../libs/dtos/public-profile.dto';

export class AdDto {
  @ApiProperty()
  uuid: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  images: string[];
  @ApiProperty()
  price: number;
  @ApiProperty()
  category: string;
  @ApiProperty()
  address: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  features: string[];
  @ApiProperty()
  condition: ECondition;
  @ApiProperty()
  brand: string;
  @ApiProperty()
  model: string;
  @ApiProperty()
  year: string;
  @ApiProperty()
  isPriceNegotiable: boolean;

  @ApiProperty()
  profile: PublicProfileDto;

  constructor(ad: IGetAd) {
    this.uuid = ad.uuid;
    this.title = ad.title || null;
    this.images = ad.images;
    this.category = ad.subCategory.category.name;
    this.address = ad.address || null;
    this.year = ad.year || null;
    this.description = ad.description;
    this.brand = ad.brand || null;
    this.condition = ad.conditions;
    this.isPriceNegotiable = ad.isPriceNegotiable;
    this.features = ad.features;
    this.phone = ad.profile.phone;
    this.price = ad.price;
    this.profile = new PublicProfileDto(ad.profile);
  }
}
