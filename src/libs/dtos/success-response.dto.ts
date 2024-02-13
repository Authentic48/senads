import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDTO {
  @ApiProperty()
  success: boolean;

  constructor() {
    this.success = true;
  }
}
