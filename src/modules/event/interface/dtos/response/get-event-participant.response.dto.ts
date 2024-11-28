import { Exclude, Expose, Type } from 'class-transformer';
import {
  EventParticipantAccessLevel,
  EventParticipantInvitationStatus,
  EventParticipantRegistrationStatus,
  EventParticipantRole,
} from '@prisma/client';
import { GetEventNetworkingParticipantResponseDto } from '@event/interface/dtos/response/get-event-networking-participant.response.dto';
import { GetUserProfileResponseDto } from '@user/interface/dtos/response/get-user-profile.response.dto';
import { EXPOSED_GROUPS } from '@shared/security/groups/exposed-group.enum';
import { GetEventParticipantTicketDto } from '@event/application/dtos/get-event-participant-ticket.dto';

@Exclude()
export class GetEventParticipantResponseDto {
  @Expose()
  id: string;

  @Expose({
    groups: [EXPOSED_GROUPS.EVENT_MANAGER, EXPOSED_GROUPS.ME],
  })
  email?: string;

  @Expose()
  role: EventParticipantRole;

  @Expose({
    groups: [EXPOSED_GROUPS.EVENT_MANAGER],
  })
  accessLevel?: EventParticipantAccessLevel;

  @Expose({
    groups: [EXPOSED_GROUPS.EVENT_MANAGER],
  })
  registerationStatus?: EventParticipantRegistrationStatus;

  @Expose({
    groups: [EXPOSED_GROUPS.EVENT_MANAGER],
  })
  invitationStatus?: EventParticipantInvitationStatus;

  @Expose({
    groups: [EXPOSED_GROUPS.EVENT_MANAGER, EXPOSED_GROUPS.ME],
  })
  registeredAt?: Date;

  @Expose({
    groups: [EXPOSED_GROUPS.EVENT_MANAGER, EXPOSED_GROUPS.ME],
  })
  checkedInAt?: Date;

  @Expose({
    groups: [EXPOSED_GROUPS.EVENT_MANAGER],
  })
  exitedAt?: Date;

  @Expose()
  @Type(() => GetUserProfileResponseDto)
  user?: GetUserProfileResponseDto;

  @Expose({
    groups: [
      EXPOSED_GROUPS.EVENT_MANAGER,
      EXPOSED_GROUPS.EVENT_NETWORKING_PARTICIPANT,
    ],
  })
  @Type(() => GetEventNetworkingParticipantResponseDto)
  networkingParticipant?: GetEventNetworkingParticipantResponseDto;

  @Expose({ groups: [EXPOSED_GROUPS.ME] })
  @Type(() => GetEventParticipantTicketDto)
  ticket?: GetEventParticipantTicketDto;
}
