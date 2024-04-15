import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IUserService } from './user';
import { PrismaService } from '../../libs/services/prisma.service';
import { ERole } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { IJWTPayload } from '../../libs/interfaces/user.interface';
import { ProfileDto } from './dtos/profile.dto';
import { UserWithProfileAndRoles } from '../../libs/utils/type';
import { IPublicProfile } from '../../libs/interfaces/ad.interface';

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

      // without await
      this.createUserProfile(newUser.uuid);

      return { userUUID: newUser.uuid, roles };
    } catch (e: any) {
      this.logger.error(e.message);
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new UnauthorizedException('auth.user_already_exist');
      }
    }
  }

  async findUserByEmail(email: string): Promise<IJWTPayload> {
    const roles: string[] = [];
    const userInfo = await this.prisma.user.findUnique({
      where: { email },
      select: {
        uuid: true,
        roles: true,
        isEmailVerified: true,
      },
    });

    userInfo?.roles?.map((role) => {
      roles.push(role.name);
    });

    return {
      userUUID: userInfo?.uuid,
      roles,
    };
  }

  async findUserByUUID(userUUID: string): Promise<UserWithProfileAndRoles> {
    return this.prisma.user.findUnique({
      where: {
        uuid: userUUID,
      },
      select: {
        uuid: true,
        roles: true,
        email: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            uuid: true,
            name: true,
            description: true,
            images: true,
            phone: true,
            isPhoneVerified: true,
            site: true,
            profileSocialMedia: true,
            address: true,
            city: {
              select: {
                id: true,
                title: true,
                area: true,
                region: true,
                regionID: true,
                profileUUID: true,
                adUUID: true,
              },
            },
            userUUID: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  private async createUserProfile(userUUID: string): Promise<void> {
    await this.prisma.profile.create({
      data: {
        uuid: userUUID,
        name: ' ',
        userUUID,
      },
    });
  }

  async updateUserProfile(
    {
      name,
      images,
      phone,
      description,
      address,
      site,
      cityID,
      socialMedia,
    }: ProfileDto,
    userUUID: string,
  ): Promise<void> {
    await this.prisma.profile.update({
      where: { userUUID },
      data: {
        name,
        images,
        phone,
        description,
        site,
        address,
      },
    });

    if (cityID) {
      await this.prisma.profile.update({
        where: {
          userUUID,
        },
        data: {
          city: {
            connect: { id: cityID },
          },
        },
      });
    }

    if (Array.isArray(socialMedia)) {
      await this.prisma.profile.update({
        where: {
          userUUID,
        },
        data: {
          profileSocialMedia: {
            deleteMany: {},
            createMany: {
              data: socialMedia,
            },
          },
        },
      });
    }
  }

  async getProfileByUUID(uuid: string): Promise<IPublicProfile> {
    const profile = await this.prisma.profile.findUnique({
      where: { uuid },
      include: {
        profileSocialMedia: true,
        user: {
          select: {
            email: true,
          },
        },
        _count: {
          select: {
            ads: true,
          },
        },
      },
    });

    if (!profile) throw new NotFoundException('profile.not_found');

    return profile;
  }
}
