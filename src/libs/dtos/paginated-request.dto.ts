import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginatedRequestDto {
  @ApiProperty({
    required: false,
    default: 10,
    minimum: 10,
    maximum: 20,
    type: 'number',
  })
  @IsInt()
  @Type(() => Number)
  @Min(10)
  @Max(20)
  limit = 10;

  @ApiProperty({
    required: false,
    default: 0,
    minimum: 0,
    type: 'number',
  })
  @IsInt()
  @Type(() => Number)
  @Min(0)
  offset = 0;
}
