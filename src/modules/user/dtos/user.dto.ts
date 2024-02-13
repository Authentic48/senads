import { ApiProperty } from '@nestjs/swagger';
import { IUserInfo } from '../../../libs/interfaces/user.interface';

export class UserDto {
  @ApiProperty()
  isEmailVerified: boolean;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  images: string[];

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  isPhoneVerified: boolean;

  constructor(user: IUserInfo) {
    this.email = user.email;
    this.phone = user.phone;
    this.name = user.name;
    this.description = user.description;
    this.isEmailVerified = user.isEmailVerified;
    this.isPhoneVerified = user.isPhoneVerified;
    this.images = user.images;
  }
}
