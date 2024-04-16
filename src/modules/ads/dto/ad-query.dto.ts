import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginatedRequestDto } from '../../../libs/dtos/paginated-request.dto';

export class AdQueryDto extends PaginatedRequestDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  subCategoryUUID: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  text: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  categoryUUID: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  profileUUID: string;

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
