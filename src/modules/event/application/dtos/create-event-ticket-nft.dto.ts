import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateEventTicketNftDto {
  @Expose()
  nftId: string;

  @Expose()
  uri: string;
}
