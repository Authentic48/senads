import { ApiProperty } from '@nestjs/swagger';
import { IGetAds } from '../../../libs/interfaces/ad.interface';

export class AdsDto {
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
  city: string;

  constructor(ad: IGetAds) {
    this.uuid = ad.uuid;
    this.title = ad.title;
    this.images = ad.images;
    this.category = ad.subCategory.category.name;
    this.city = ad.city?.region.title || null;
    this.price = ad.price;
  }
}
