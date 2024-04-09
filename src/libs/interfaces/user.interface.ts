import { EJwtTokenTypes } from '../utils/enum';

export interface IJWTPayload {
  userUUID: string;
  type?: EJwtTokenTypes;
  deviceUUID?: string;
  accessTokenUUID?: string;
  roles: string[];
}
