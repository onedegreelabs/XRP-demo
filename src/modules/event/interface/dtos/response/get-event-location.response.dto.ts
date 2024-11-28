import { LocationType } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetEventLocationResponseDto {
  @Expose()
  type?: LocationType;

  @Expose()
  placeId?: string;

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

  @Expose()
  detailAddress?: string;

  @Expose()
  latitude?: number;

  @Expose()
  longitude?: number;
}
