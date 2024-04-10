import { Prisma } from '@prisma/client';

const userWithProfileAndRoles = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    roles: true,
    profile: {
      include: {
        profileSocialMedia: true,
        city: {
          include: {
            region: true,
          },
        },
      },
    },
  },
});

export type UserWithProfileAndRoles = Prisma.UserGetPayload<
  typeof userWithProfileAndRoles
>;
