import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { EventHostAccessLevel, UserRole } from '@prisma/client';
import { AccessGuard } from '@shared/security/guards/access.guard';
import { UserRolesGuard } from '@shared/security/guards/user-roles.guard';
import { EventManagerGuard } from '@event/application/security/guards/event-manager.guard';

export function EventManager() {
  return applyDecorators(
    SetMetadata('userRoles', [UserRole.ADMIN, UserRole.MEMBER]),
    SetMetadata('eventHostAccessLevels', [
      EventHostAccessLevel.OWNER,
      EventHostAccessLevel.MANAGER,
    ]),
    UseGuards(AccessGuard, UserRolesGuard, EventManagerGuard),
  );
}
