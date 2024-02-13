import { ApiProperty } from '@nestjs/swagger';

export class AuthSuccessResponseDTO {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
