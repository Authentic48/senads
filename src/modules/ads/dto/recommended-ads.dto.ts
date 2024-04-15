import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RecommendedAdsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  subCategoryUUID: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  categoryUUID: string;
}
