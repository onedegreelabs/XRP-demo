import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { UserAccessLevel, UserRole } from '@prisma/client';
import { AccessGuard } from '@shared/security/guards/access.guard';
import { UserRolesGuard } from '@shared/security/guards/user-roles.guard';
import { MembershipGuard } from '@shared/security/guards/membership.guard';

export function FreeMembership() {
  return applyDecorators(
    SetMetadata('userRoles', [UserRole.ADMIN, UserRole.MEMBER]),
    SetMetadata('userAccessLevels', [
      UserAccessLevel.FREE,
      UserAccessLevel.PRO,
    ]),
    UseGuards(AccessGuard, UserRolesGuard, MembershipGuard),
  );
}
