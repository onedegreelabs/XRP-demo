import { Exclude, Expose } from 'class-transformer';
import { LocationType } from '@prisma/client';

@Exclude()
export class GetUserLocationDto {
  @Expose()
  id?: string;

  @Expose()
  type: LocationType;

  @Expose()
  country: string;

  @Expose()
  region: string;

  @Expose()
  city: string;

  @Expose()
  shortAddress: string;

  @Expose()
  fullAddress: string;
}
