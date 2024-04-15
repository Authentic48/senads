import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  @ApiProperty()
  count: number;

  @ApiProperty()
  offset: number;
  @ApiProperty()
  limit: number;

  @ApiProperty()
  data: T[];

  constructor(data: PaginatedResponseDto<T>) {
    this.count = data.count;
    this.limit = data.limit;
    this.offset = data.offset;
    this.data = data.data;
  }
}
