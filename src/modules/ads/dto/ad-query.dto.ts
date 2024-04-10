import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class AdQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  subCategoryUUID: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  categoryUUID: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  cityID: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  regionID: number;
}
