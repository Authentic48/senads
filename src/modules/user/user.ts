import { IUserInfo } from '../../libs/interfaces/user.interface';

export interface IUserService {
  createUser(phone: string): Promise<{ userUUID: string; roles: string[] }>;
  findUserByEmail(uuid: string): Promise<IUserInfo | null>;
  findUserByUUID(userUUID: string): Promise<IUserInfo | null>;
}
