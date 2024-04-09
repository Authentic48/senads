import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { ESocialMediaType } from '@prisma/client';

export class SocialMediaDto {
  @ApiProperty()
  @IsEnum(ESocialMediaType)
  network: ESocialMediaType;

  @ApiProperty()
  @IsString()
  url: string;
}
