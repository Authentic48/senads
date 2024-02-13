import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiHeader,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthDto } from './dtos/auth.dto';
import { UserInfo } from '../../libs/decorators/user-info.decorator';
import { IJWTPayload } from '../../libs/interfaces/user.interface';
import { AuthGuard } from '../../libs/guards/auth.guard';
import { SuccessResponseDTO } from '../../libs/dtos/success-response.dto';
import { AuthSuccessResponseDTO } from './dtos/success.dto';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dtos/send-otp.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

@ApiTags('Auth - User authentication, authorization, refresh,  logout')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('send-otp')
  @ApiForbiddenResponse({
    description: 'Try again after a minute',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: SuccessResponseDTO,
  })
  async generateOTP(
    @Body() { email }: SendOtpDto,
  ): Promise<{ success: boolean }> {
    return this.authService.generateOTP(email);
  }
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @ApiUnauthorizedResponse({
    description: 'UnAuthorized',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Success',
    type: AuthSuccessResponseDTO,
  })
  async register(
    @Body() { email, code }: AuthDto,
  ): Promise<AuthSuccessResponseDTO> {
    return this.authService.register(email, code);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiUnauthorizedResponse({
    description: 'UnAuthorized',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: AuthSuccessResponseDTO,
  })
  async login(
    @Body() { email, code }: AuthDto,
  ): Promise<AuthSuccessResponseDTO> {
    return this.authService.login(email, code);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'accessToken',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: SuccessResponseDTO,
  })
  async logout(
    @UserInfo() { deviceUUID }: IJWTPayload,
  ): Promise<SuccessResponseDTO> {
    return this.authService.logout(deviceUUID);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiUnauthorizedResponse({
    description: 'UnAuthorized',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: AuthSuccessResponseDTO,
  })
  async refresh(
    @Body() { refreshToken }: RefreshTokenDto,
  ): Promise<AuthSuccessResponseDTO> {
    return this.authService.refresh(refreshToken);
  }
}
