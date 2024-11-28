import { LocationType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { UpsertUserLocationDto } from '@user/application/dtos/upsert-user-location.dto';

export class UpsertUserLocationRequestBodyDto implements UpsertUserLocationDto {
  @IsNotEmpty()
  @IsEnum(LocationType)
  type: LocationType;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  country: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  region: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  city: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  shortAddress: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  fullAddress: string;
}
