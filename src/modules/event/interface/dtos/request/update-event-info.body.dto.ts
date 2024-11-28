import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsTimeZone,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EventVisibility } from '@prisma/client';
import { UpsertEventLocationRequestBodyDto } from '@event/interface/dtos/request/upsert-event-location.body.dto';
import { Transform, Type } from 'class-transformer';
import { UpdateEventDto } from '@event/application/dtos/update-event.dto';
import { IsJsonValue } from '@shared/decorators/validator/is-json-value.decorator';
import { JsonValue } from '@shared/types/json.type';

export class UpdateEventInfoRequestBodyDto implements UpdateEventDto {
  @ApiProperty({
    type: String,
    description: '이벤트 타입ID',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  typeId: string;

  @ApiProperty({
    type: String,
    description: '이벤트 분야ID',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  fieldId: string;

  @ApiProperty({
    type: String,
    description: '이벤트 제목',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    type: Object,
    description: '이벤트 상세 정보: 마크다운 형식(JSON)',
  })
  @IsOptional()
  @IsJsonValue()
  description: JsonValue;

  @ApiProperty({
    type: String,
    description: '커버이미지 s3 key',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  coverImage: string;

  @ApiProperty({
    type: Date,
    description: '시작일시',
  })
  @IsNotEmpty()
  @IsDate()
  startAt: Date;

  @ApiProperty({
    type: Date,
    description: '종료일시',
  })
  @IsNotEmpty()
  @IsDate()
  endAt: Date;

  @ApiProperty({
    type: String,
    description: 'Timezone',
  })
  @IsNotEmpty()
  @IsTimeZone()
  timezone: string;

  @ApiProperty({
    type: String,
    description: '이벤트 온라인 가상링크',
  })
  @IsOptional()
  @IsUrl()
  @Transform(({ value }) => (value === '' ? null : value))
  virtualLink: string;

  @ApiProperty({
    type: UpsertEventLocationRequestBodyDto,
    description: '이벤트 오프라인 장소',
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpsertEventLocationRequestBodyDto)
  location: UpsertEventLocationRequestBodyDto;

  @ApiProperty({
    enum: EventVisibility,
    description: '이벤트 공개범위',
  })
  @IsNotEmpty()
  @IsEnum(EventVisibility)
  visibility: EventVisibility;
}
