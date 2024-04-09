import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { IJWTPayload } from '../../libs/interfaces/user.interface';
import {
  ApiHeader,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../../libs/guards/auth.guard';
import { UserInfo } from '../../libs/decorators/user-info.decorator';
import { UserDto } from './dtos/user.dto';
import { ProfileDto } from './dtos/profile.dto';
import { SuccessResponseDTO } from '../../libs/dtos/success-response.dto';

@ApiTags('Profile - Users profile information')
@Controller('profile')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'Access Token',
  })
  @ApiUnauthorizedResponse({
    description: 'UnAuthorized',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: UserDto,
  })
  async getUserInfo(@UserInfo() { userUUID }: IJWTPayload): Promise<UserDto> {
    const profile = await this.userService.findUserByUUID(userUUID);

    return new UserDto(profile);
  }

  @Patch()
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'Access Token',
  })
  @ApiUnauthorizedResponse({
    description: 'UnAuthorized',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: SuccessResponseDTO,
  })
  async updateUserProfile(
    @Body() data: ProfileDto,
    @UserInfo() { userUUID }: IJWTPayload,
  ): Promise<SuccessResponseDTO> {
    await this.userService.updateUserProfile(data, userUUID);

    return new SuccessResponseDTO();
  }
}
