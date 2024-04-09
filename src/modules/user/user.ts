import { IJWTPayload } from '../../libs/interfaces/user.interface';
import { ProfileDto } from './dtos/profile.dto';
import { UserWithProfileAndRoles } from '../../libs/utils/type';

export interface IUserService {
  createUser(phone: string): Promise<{ userUUID: string; roles: string[] }>;
  findUserByEmail(uuid: string): Promise<IJWTPayload | null>;
  findUserByUUID(userUUID: string): Promise<UserWithProfileAndRoles>;
  updateUserProfile(data: ProfileDto, userUUID: string): Promise<void>;
}
