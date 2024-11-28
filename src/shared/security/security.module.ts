import { Global, Module } from '@nestjs/common';
import { AccessGuard } from '@shared/security/guards/access.guard';
import { UserRolesGuard } from '@shared/security/guards/user-roles.guard';
import { MembershipGuard } from '@shared/security/guards/membership.guard';

@Global()
@Module({
  providers: [UserRolesGuard, AccessGuard, MembershipGuard],
  exports: [UserRolesGuard, AccessGuard, MembershipGuard],
})
export class SecurityModule {}
