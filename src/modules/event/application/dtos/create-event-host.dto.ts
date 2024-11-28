import { Exclude, Expose } from 'class-transformer';
import {
  EventHostAccessLevel,
  EventHostInvitationStatus,
} from '@prisma/client';

@Exclude()
export class CreateEventHostDto {
  @Expose()
  email: string;

  @Expose()
  listingEnabled: boolean;

  @Expose()
  accessLevel: EventHostAccessLevel;

  @Expose()
  status: EventHostInvitationStatus;
}
