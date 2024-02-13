import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { IJWTPayload, IUserInfo } from '../../libs/interfaces/user.interface';
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

@ApiTags('Users - Users Information')
@Controller('user-info')
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
  async getUserInfo(@UserInfo() { userUUID }: IJWTPayload): Promise<IUserInfo> {
    return this.userService.findUserByUUID(userUUID);
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
