import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SubCategoryQueryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  categoryUUID: string;
}
