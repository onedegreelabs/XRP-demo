import { Exclude, Expose, Type } from 'class-transformer';
import { EventTicketType } from '@prisma/client';
import { GetEventDto } from '@event/application/dtos/get-event.dto';

@Exclude()
export class GetEventTicketDto {
  @Expose()
  id: string;

  @Expose()
  type: EventTicketType;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  capacity: number;

  @Expose()
  approvalRequired: boolean;

  @Expose()
  salesStartAt: Date;

  @Expose()
  salesEndAt: Date;

  @Expose()
  @Type(() => GetEventDto)
  event?: GetEventDto;
}
