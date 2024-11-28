import { Exclude, Expose } from 'class-transformer';
import { JsonValue } from '@shared/types/json.type';
import { EventVisibility } from '@prisma/client';

@Exclude()
export class UpdateEventDto {
  @Expose()
  title: string;

  @Expose()
  description: JsonValue;

  @Expose()
  coverImage: string;

  @Expose()
  virtualLink: string;

  @Expose()
  startAt: Date;

  @Expose()
  endAt: Date;

  @Expose()
  timezone: string;

  @Expose()
  visibility: EventVisibility;
}
