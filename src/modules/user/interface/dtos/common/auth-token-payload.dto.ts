import { UserAccessLevel, UserRole } from '@prisma/client';

export class AuthTokenPayloadDto {
  constructor(
    public userId: string,
    public deviceId: string,
    public email: string,
    public name: string,
    public accessLevel: UserAccessLevel,
    public role: UserRole,
  ) {}
}
