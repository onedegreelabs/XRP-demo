import { Exclude, Expose, Type } from 'class-transformer';
import { EventTicketStatus } from '@prisma/client';
import { GetEventParticipantDto } from '@event/application/dtos/get-event-participant.dto';
import { GetEventTicketDto } from '@event/application/dtos/get-event-ticket.dto';

@Exclude()
export class GetEventParticipantTicketDto {
  @Expose()
  id: string;

  @Expose()
  status: EventTicketStatus;

  @Expose()
  @Type(() => GetEventParticipantDto)
  participant?: GetEventParticipantDto;

  @Expose()
  @Type(() => GetEventTicketDto)
  tickets?: GetEventTicketDto;
}
