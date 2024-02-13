import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
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
import { User } from './dtos/user.dto';

@ApiTags('Users - Users Information')
@Controller('user-info')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiHeader({
    name: 'Access Token',
  })
  @ApiUnauthorizedResponse({
    description: 'UnAuthorized',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: User,
  })
  @UseGuards(AuthGuard)
  @Get()
  async getUserInfo(@UserInfo() { userUUID }: IJWTPayload): Promise<IUserInfo> {
    return this.userService.findUserByUUID(userUUID);
  }
}
