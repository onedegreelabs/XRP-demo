import { Exclude, Expose } from 'class-transformer';
import {
  EventParticipantAccessLevel,
  EventParticipantRegistrationStatus,
  EventParticipantRole,
} from '@prisma/client';

@Exclude()
export class CreateEventParticipantDto {
  @Expose()
  email: string;

  @Expose()
  labelId: string;

  @Expose()
  registrationStatus: EventParticipantRegistrationStatus;

  @Expose()
  role: EventParticipantRole;

  @Expose()
  accessLevel: EventParticipantAccessLevel;
}
