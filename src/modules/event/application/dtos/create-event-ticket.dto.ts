import { Exclude, Expose } from 'class-transformer';
import { EventTicketType } from '@prisma/client';

@Exclude()
export class CreateEventTicketDto {
  @Expose()
  type?: EventTicketType;

  @Expose()
  name?: string;

  @Expose()
  description?: string;

  @Expose()
  capacity?: number;

  @Expose()
  price?: number;

  @Expose()
  salesStartAt: Date;

  @Expose()
  salesEndAt: Date;

  @Expose()
  approvalRequired: boolean;
}
