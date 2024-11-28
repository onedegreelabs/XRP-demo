import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { EventVisibility } from '@prisma/client';
import { JsonValue } from '@shared/types/json.type';
import { ApiProperty } from '@nestjs/swagger';
import { transformImageURL } from '@util/index';
import { GetEventLocationResponseDto } from '@event/interface/dtos/response/get-event-location.response.dto';
import { GetEventHostResponseDto } from '@event/interface/dtos/response/get-event-host.response.dto';
import { GetEventTicketResponseDto } from '@event/interface/dtos/response/get-event-ticket.response.dto';
import { EXPOSED_GROUPS } from '@shared/security/groups/exposed-group.enum';
import { GetEventParticipantResponseDto } from '@event/interface/dtos/response/get-event-participant.response.dto';

@Exclude()
export class GetEventInfoResponseDto {
  @Expose()
  id: string;

  @Expose()
  field: string;

  @Expose()
  handle: string;

  @Expose()
  @Transform(({ value }) => transformImageURL(value), {
    toClassOnly: true,
  })
  coverImage?: string;

  @Expose()
  title: string;

  @Expose()
  description?: JsonValue;

  @Expose()
  timezone: string;

  @Expose()
  startAt: Date;

  @ApiProperty({
    type: Date,
    description: '이벤트 종료일시',
  })
  @Expose()
  endAt: Date;

  @Expose()
  virtualLink?: string;

  @Expose()
  views: number;

  @Expose()
  visibility: EventVisibility;

  @Expose()
  @Type(() => GetEventLocationResponseDto)
  location?: GetEventLocationResponseDto;

  @Expose({
    groups: [EXPOSED_GROUPS.EVENT_MANAGER],
  })
  registrationCapacity?: number;

  @Expose({
    groups: [EXPOSED_GROUPS.EVENT_MANAGER],
  })
  registrationEnabled?: boolean;

  @Expose({
    groups: [EXPOSED_GROUPS.EVENT_MANAGER],
  })
  waitlistEnabled?: boolean;

  @Expose({
    groups: [EXPOSED_GROUPS.EVENT_MANAGER],
  })
  waitlitistCapacity?: number;

  @Expose()
  @Type(() => GetEventHostResponseDto)
  hosts?: GetEventHostResponseDto[];

  @Expose()
  @Type(() => GetEventTicketResponseDto)
  tickets?: GetEventTicketResponseDto[];

  @Expose()
  @Type(() => GetEventParticipantResponseDto)
  participants?: GetEventParticipantResponseDto[];
}
