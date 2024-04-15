import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCityDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;
}
