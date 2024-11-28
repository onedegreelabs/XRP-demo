import { UserAccessLevel, UserRole } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UpdateUserDto {
  @Expose()
  name?: string;

  @Expose()
  avatar?: string;

  @Expose()
  bio?: string;

  @Expose()
  organization?: string;

  @Expose()
  jobTitle?: string;

  @Expose()
  handle?: string;

  @Expose()
  accessLevel?: UserAccessLevel;

  @Expose()
  role?: UserRole;
}
