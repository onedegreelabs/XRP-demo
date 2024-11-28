import { LocationType } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UpsertUserLocationDto {
  @Expose()
  type: LocationType;

  @Expose()
  country?: string;

  @Expose()
  region?: string;

  @Expose()
  city?: string;

  @Expose()
  shortAddress?: string;

  @Expose()
  fullAddress?: string;
}
