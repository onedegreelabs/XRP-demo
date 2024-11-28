import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateEventResponseDto {
  @Expose()
  eventId: string;
}
