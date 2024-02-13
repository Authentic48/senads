import { randomInt } from 'crypto';
import { EJwtTokenTypes } from '../utils/enum';

export const generateOTP = () => {
  return randomInt(10000, 99999);
};

export const getBlackListTokenKey = (
  accessTokenUUID: string,
  type: EJwtTokenTypes,
): string => {
  if (type === EJwtTokenTypes.ACCESS_TOKEN)
    return `access-token-${accessTokenUUID}`;

  return `refresh-token-${accessTokenUUID}`;
};
