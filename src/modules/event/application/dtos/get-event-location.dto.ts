import { Exclude, Expose } from 'class-transformer';
import { LocationType } from '@prisma/client';

@Exclude()
export class GetEventLocationDto {
  @Expose()
  type: LocationType;

  @Expose()
  placeId: string;

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

  @Expose()
  detailAddress: string;

  @Expose()
  latitude: number;

  @Expose()
  longitude: number;
}
