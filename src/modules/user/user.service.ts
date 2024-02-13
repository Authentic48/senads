import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { IUserService } from './user';
import { PrismaService } from '../../libs/services/prisma.service';
import { ERole } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { IUserInfo } from '../../libs/interfaces/user.interface';
import { ProfileDto } from './dtos/profile.dto';

@Injectable()
export class UserService implements IUserService {
  private readonly logger: Logger = new Logger(UserService.name);
  constructor(private readonly prisma: PrismaService) {}
  async createUser(
    email: string,
  ): Promise<{ userUUID: string; roles: string[] }> {
    try {
      const newUser = await this.prisma.user.create({
        data: {
          email,
          isEmailVerified: true,
          roles: {
            create: {
              name: ERole.BUSINESS,
            },
          },
        },
        select: {
          uuid: true,
          roles: true,
        },
      });
      const roles: string[] = [];

      this.logger.debug(
        `New user successfully created, userUUID: ${newUser.uuid}, email: ${email}`,
      );

      newUser.roles.map((role) => {
        roles.push(role.name);
      });

      return { userUUID: newUser.uuid, roles };
    } catch (e: any) {
      this.logger.error(e.message);
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new UnauthorizedException('auth.user_already_exist');
      }
    }
  }

  async findUserByEmail(email: string): Promise<IUserInfo> {
    const roles: string[] = [];
    const userInfo = await this.prisma.user.findUnique({
      where: { email },
      select: {
        uuid: true,
        roles: true,
        isEmailVerified: true,
      },
    });

    userInfo.roles.map((role) => {
      roles.push(role.name);
    });

    return {
      userUUID: userInfo.uuid,
      isEmailVerified: userInfo.isEmailVerified,
      roles,
    };
  }

  async findUserByUUID(userUUID: string): Promise<IUserInfo> {
    const roles: string[] = [];
    const userInfo = await this.prisma.user.findUniqueOrThrow({
      where: {
        uuid: userUUID,
      },
      select: {
        uuid: true,
        roles: true,
        email: true,
        isEmailVerified: true,
        profile: true,
      },
    });

    userInfo.roles.map((role) => {
      roles.push(role.name);
    });

    return {
      userUUID: userInfo.uuid,
      isEmailVerified: userInfo.isEmailVerified,
      roles,
      name: userInfo.profile?.name,
      description: userInfo.profile?.description,
      images: userInfo.profile?.images,
      email: userInfo.email,
      phone: userInfo.profile?.phone,
      isPhoneVerified: userInfo.profile.isPhoneVerified,
    };
  }

  async updateUserProfile(
    { name, images, phone, description }: ProfileDto,
    userUUID: string,
  ): Promise<void> {
    await this.prisma.profile.upsert({
      where: { userUUID },
      update: {
        name,
        images,
        phone,
        description,
      },
      create: {
        name,
        images,
        phone,
        description,
        userUUID,
      },
    });
  }
}
