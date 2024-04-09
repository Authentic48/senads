import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { IAuth } from './auth';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { InternalJWTService } from '../jwt/jwt.service';
import { SessionService } from '../session/session.service';
import { OtpService } from '../otp/otp.service';
import { EJwtTokenTypes } from '../../libs/utils/enum';

@Injectable()
export class AuthService implements IAuth {
  private readonly ACCESS_TOKEN_LIFE_TIME: number;
  private readonly VERIFY_OTP_ACCESS_TOKEN_LIFE_TIME: number;

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwt: InternalJWTService,
    private readonly session: SessionService,
    private readonly otpService: OtpService,
  ) {
    this.ACCESS_TOKEN_LIFE_TIME = parseInt(
      this.configService.get('ACCESS_TOKEN_LIFE_TIME'),
    );

    this.VERIFY_OTP_ACCESS_TOKEN_LIFE_TIME = parseInt(
      this.configService.get('VERIFY_OTP_ACCESS_TOKEN_LIFE_TIME'),
    );
  }

  async generateOTP(email: string): Promise<void> {
    if (!(await this.otpService.canGenerateOTP(email)))
      throw new ForbiddenException('errors.try_again_after_a_minute');
    // without await
    this.otpService.saveAndSendOTP(email, this.otpService.generateOTP());
  }

  async refresh(
    incomingRefreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { isTokenValid, payload } = await this.jwt.verifyToken(
      incomingRefreshToken,
      EJwtTokenTypes.REFRESH_TOKEN,
    );

    if (!isTokenValid) {
      throw new UnauthorizedException(
        'auth.session_expired_or_invalid_refresh_token',
      );
    }

    const { accessToken, refreshToken, accessTokenUUID } =
      await this.jwt.generateTokenPair(
        {
          userUUID: payload.userUUID,
          roles: payload.roles,
        },
        payload.deviceUUID,
      );

    await this.session.updateSession(
      refreshToken,
      payload.deviceUUID,
      payload.userUUID,
      accessTokenUUID,
      payload.accessTokenUUID,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(
    email: string,
    code: number,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    await this.verifyOTP(email, code);

    const { userUUID, roles } = await this.userService.createUser(email);

    const deviceUUID = randomUUID();

    const { accessToken, refreshToken, accessTokenUUID } =
      await this.jwt.generateTokenPair(
        {
          userUUID,
          roles,
        },
        deviceUUID,
      );

    await this.session.createSession(
      deviceUUID,
      accessTokenUUID,
      refreshToken,
      userUUID,
    );

    return { accessToken, refreshToken };
  }

  async login(
    email: string,
    code: number,
  ): Promise<{ accessToken; refreshToken }> {
    await this.verifyOTP(email, code);

    const user = await this.userService.findUserByEmail(email);

    if (!user.userUUID) {
      throw new UnauthorizedException('auth.invalid_credentials');
    }

    const deviceUUID = randomUUID();

    const { accessToken, refreshToken, accessTokenUUID } =
      await this.jwt.generateTokenPair(
        {
          userUUID: user.userUUID,
          roles: user.roles,
        },
        deviceUUID,
      );

    await this.session.createSession(
      deviceUUID,
      accessTokenUUID,
      refreshToken,
      user.userUUID,
    );

    return { accessToken, refreshToken };
  }

  private async verifyOTP(email: string, code: number): Promise<void> {
    if (!(await this.otpService.verifyOTP(email, code)))
      throw new UnauthorizedException('errors.invalid_code');

    await this.otpService.deleteOTP(email);
  }

  async logout(deviceUUID: string): Promise<void> {
    return await this.session.deleteSession(deviceUUID);
  }
}
