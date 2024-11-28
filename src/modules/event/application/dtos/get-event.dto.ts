import { Exclude, Expose, Type } from 'class-transformer';
import { GetEventSettingDto } from '@event/application/dtos/get-event-setting.dto';
import { GetEventLocationDto } from '@event/application/dtos/get-event-location.dto';
import { EventVisibility } from '@prisma/client';
import { JsonValue } from '@shared/types/json.type';
import { GetEventHostDto } from '@event/application/dtos/get-event-host.dto';
import { GetEventTicketDto } from '@event/application/dtos/get-event-ticket.dto';
import { GetEventParticipantDto } from '@event/application/dtos/get-event-participant.dto';

@Exclude()
export class GetEventDto {
  @Expose()
  id: string;

  @Expose()
  field: string;

  @Expose()
  handle: string;

  @Expose()
  coverImage: string;

  @Expose()
  title: string;

  @Expose()
  description: JsonValue;

  @Expose()
  startAt: Date;

  @Expose()
  endAt: Date;

  @Expose()
  timezone: string;

  @Expose()
  views: number;

  @Expose()
  visibility: EventVisibility;

  @Expose()
  virtualLink: string;

  @Expose()
  @Type(() => GetEventLocationDto)
  location?: GetEventLocationDto;

  @Expose()
  @Type(() => GetEventSettingDto)
  setting?: GetEventSettingDto;

  @Expose()
  @Type(() => GetEventHostDto)
  hosts?: GetEventHostDto[];

  @Expose()
  @Type(() => GetEventTicketDto)
  tickets?: GetEventTicketDto[];

  @Expose()
  @Type(() => GetEventParticipantDto)
  participants?: GetEventParticipantDto[];
}
