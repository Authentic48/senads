import { ApiProperty } from '@nestjs/swagger';

export class SuccessUploadDto {
  @ApiProperty()
  url: string;

  constructor(url: string) {
    this.url = url;
  }
}
