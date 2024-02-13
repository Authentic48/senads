import { SetMetadata } from '@nestjs/common';
import { ERole } from '@prisma/client';
import { EMetaKeys } from '../utils/enum';

export const Roles = (...roles: ERole[]) =>
  SetMetadata(EMetaKeys.ROLES_GUARD_KEY, roles);
