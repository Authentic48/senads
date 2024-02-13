import { IUserInfo } from '../../libs/interfaces/user.interface';
import { ProfileDto } from './dtos/profile.dto';

export interface IUserService {
  createUser(phone: string): Promise<{ userUUID: string; roles: string[] }>;
  findUserByEmail(uuid: string): Promise<IUserInfo | null>;
  findUserByUUID(userUUID: string): Promise<IUserInfo | null>;
  updateUserProfile(data: ProfileDto, userUUID: string): Promise<void>;
}
