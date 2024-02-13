export interface IUser {
  phone: string;
  uuid: string;
  isPhoneVerified: boolean;
  email: string;
}

export interface IUserInfo {
  userUUID: string;
  roles: string[];
  isEmailVerified: boolean;
  name?: string;
  description?: string;
  images?: string[];
  phone?: string;
  email?: string;
  isPhoneVerified?: boolean;
}

import { EJwtTokenTypes } from '../utils/enum';

export interface IJWTPayload {
  userUUID: string;
  type?: EJwtTokenTypes;
  deviceUUID?: string;
  accessTokenUUID?: string;
  roles: string[];
}
