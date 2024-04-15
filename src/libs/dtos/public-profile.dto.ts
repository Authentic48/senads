import { ESocialMediaType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IPublicProfile } from '../interfaces/ad.interface';

export class SocialMediaDto {
  @ApiProperty()
  network: ESocialMediaType;

  @ApiProperty()
  url: string;
}
export class PublicProfileDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phone: string;

  @ApiProperty({
    type: SocialMediaDto,
    isArray: true,
  })
  socialMedia: SocialMediaDto[];

  @ApiProperty()
  site: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  count: number;

  constructor(data: IPublicProfile) {
    this.uuid = data.uuid;
    this.name = data.name;
    this.site = data.site;
    this.phone = data.phone;
    this.description = data.description;
    this.email = data.name;
    this.socialMedia = data.profileSocialMedia.map((el) => ({
      url: el.url,
      network: el.network,
    }));
    this.count = data._count.ads || null;
  }
}
