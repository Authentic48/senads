import { ApiProperty } from '@nestjs/swagger';

export class AdDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  images: string[];

  @ApiProperty()
  address: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  subCategory: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  createdAt: Date;
}
