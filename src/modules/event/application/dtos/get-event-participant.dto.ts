import { Exclude, Expose, Type } from 'class-transformer';
import {
  EventParticipantAccessLevel,
  EventParticipantInvitationStatus,
  EventParticipantRegistrationStatus,
  EventParticipantRole,
} from '@prisma/client';
import { GetUserDto } from '@user/application/dtos/get-user.dto';
import { GetEventNetworkingParticipantDto } from '@event/application/dtos/get-event-networking-participant.dto';
import { GetEventParticipantTicketDto } from '@event/application/dtos/get-event-participant-ticket.dto';

@Exclude()
export class GetEventParticipantDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  role: EventParticipantRole;

  @Expose()
  accessLevel: EventParticipantAccessLevel;

  @Expose()
  registerationStatus: EventParticipantRegistrationStatus;

  @Expose()
  invitationStatus: EventParticipantInvitationStatus;

  @Expose()
  createdAt?: Date;

  @Expose()
  updatedAt?: Date;

  @Expose()
  registeredAt: Date;

  @Expose()
  checkedInAt: Date;

  @Expose()
  exitedAt: Date;

  @Expose()
  @Type(() => GetUserDto)
  user?: GetUserDto;

  @Expose()
  @Type(() => GetEventNetworkingParticipantDto)
  networkingParticipant?: GetEventNetworkingParticipantDto;

  @Expose()
  @Type(() => GetEventParticipantTicketDto)
  ticket?: GetEventParticipantTicketDto;
}
