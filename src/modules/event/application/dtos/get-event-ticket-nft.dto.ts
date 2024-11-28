import { Exclude, Expose, Type } from 'class-transformer';
import { EventTicketNftStatus } from '@prisma/client';
import { GetUserDto } from '@user/application/dtos/get-user.dto';

@Exclude()
export class GetEventTicketNftDto {
  @Expose()
  id: string;

  @Expose()
  nftId: string;

  @Expose()
  uri: string;

  @Expose()
  status: EventTicketNftStatus;

  @Expose()
  @Type(() => GetUserDto)
  owner?: GetUserDto;
}
