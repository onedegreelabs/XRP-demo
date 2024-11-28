import { Exclude, Expose, Type } from 'class-transformer';
import {
  EventHostAccessLevel,
  EventHostInvitationStatus,
} from '@prisma/client';
import { GetUserDto } from '@user/application/dtos/get-user.dto';

@Exclude()
export class GetEventHostDto {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  email: string;

  @Expose()
  handle: string;

  @Expose()
  name: string;

  @Expose()
  avatar: string;

  @Expose()
  accessLevel: EventHostAccessLevel;

  @Expose()
  invitationStatus: EventHostInvitationStatus;

  @Expose()
  listingEnabled: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  invitedAt: Date;

  @Expose()
  @Type(() => GetUserDto)
  user: GetUserDto;
}
