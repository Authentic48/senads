import { ApiProperty } from '@nestjs/swagger';
import { SocialMediaDto } from './social-media.dto';
import { UserWithProfileAndRoles } from '../../../libs/utils/type';

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

  @ApiProperty()
  site: string;

  @ApiProperty()
  city: object;

  @ApiProperty()
  address: string;

  @ApiProperty({ type: [SocialMediaDto] })
  socialMedia: SocialMediaDto[];

  constructor(user: UserWithProfileAndRoles) {
    this.email = user.email;
    this.phone = user.profile?.phone || null;
    this.name = user.profile?.name || null;
    this.description = user.profile?.description || null;
    this.isEmailVerified = user.isEmailVerified;
    this.isPhoneVerified = user.profile?.isPhoneVerified;
    this.images = user.profile?.images;
    this.site = user.profile?.site || null;
    this.socialMedia = user.profile?.profileSocialMedia || [];
    this.address = user.profile?.address || null;
    this.city = user.profile?.city || null;
  }
}
