import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { AccessGuard } from '@shared/security/guards/access.guard';
import { UserRolesGuard } from '@shared/security/guards/user-roles.guard';

export function Admin() {
  return applyDecorators(
    SetMetadata('userRoles', [UserRole.ADMIN]),
    UseGuards(AccessGuard, UserRolesGuard),
  );
}
