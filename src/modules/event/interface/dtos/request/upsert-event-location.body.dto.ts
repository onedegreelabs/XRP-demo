import { ApiProperty } from '@nestjs/swagger';
import { LocationType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UpsertEventLocationDto } from '@event/application/dtos/upsert-event-location.dto';

export class UpsertEventLocationRequestBodyDto
  implements UpsertEventLocationDto
{
  @ApiProperty({
    enum: LocationType,
    description: '위치 저장 방식 (GOOGLE or MANUAL)',
  })
  @IsNotEmpty()
  @IsEnum(LocationType)
  type: LocationType;

  @ApiProperty({
    type: String,
    description: '구글맵 제공 Place ID',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  placeId: string;

  @ApiProperty({
    type: String,
    description: 'country',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  country: string;

  @ApiProperty({
    type: String,
    description: 'administrative_area_level_1',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  region: string;

  @ApiProperty({
    type: String,
    description: 'locality or administrative_area_level_2',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  city: string;

  @ApiProperty({
    type: String,
    description: '구글맵 제공 간략 주소 or 수동 입력 주소',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  shortAddress: string;

  @ApiProperty({
    type: String,
    description: '구글맵 제공 상세 주소',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  fullAddress: string;

  @ApiProperty({
    type: String,
    description: '상세 주소',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  detailAddress: string;

  @ApiProperty({
    type: Number,
    description: '위도',
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value === '' ? null : value))
  latitude: number;

  @ApiProperty({
    type: Number,
    description: '경도',
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value === '' ? null : value))
  longitude: number;
}
