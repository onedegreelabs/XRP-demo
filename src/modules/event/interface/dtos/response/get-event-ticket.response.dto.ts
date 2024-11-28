import { Exclude, Expose } from 'class-transformer';
import { EventTicketType } from '@prisma/client';

@Exclude()
export class GetEventTicketResponseDto {
  @Expose()
  id: string;

  @Expose()
  type: EventTicketType;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  price: number;

  @Expose()
  capacity: number;

  @Expose()
  salesEndAt: Date;

  @Expose()
  slaesStartAt: Date;

  @Expose()
  approvalRequired: boolean;
}
