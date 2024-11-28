import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UpsertEventLocationRequestBodyDto } from '@event/interface/dtos/request/upsert-event-location.body.dto';
import { Transform, Type } from 'class-transformer';
import { JsonValue } from '@shared/types/json.type';
import { IsJsonValue } from '@shared/decorators/validator/is-json-value.decorator';

export class CreateEventRequestBodyDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  field: string;

  @IsOptional()
  @IsJsonValue()
  description: JsonValue;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  coverImage: string;

  @IsNotEmpty()
  @IsDate()
  startAt: Date;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpsertEventLocationRequestBodyDto)
  location: UpsertEventLocationRequestBodyDto;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  registrationCapacity: number;
}
