import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { USER_CONSTRAINTS } from '@user/interface/constants/user.constant';
import { Transform, Type } from 'class-transformer';
import { UpsertUserLocationRequestBodyDto } from '@user/interface/dtos/request/upsert-user-location.body.dto';
import { UpsertUserSocialBodyDto } from '@user/interface/dtos/request/upsert-user-social.body.dto';

export class UpdateProfileRequestBodyDto {
  @IsOptional()
  @IsString()
  @Length(USER_CONSTRAINTS.NAME_MIN_LENGTH, USER_CONSTRAINTS.NAME_MAX_LENGTH)
  @Transform(({ value }) => (value === '' ? null : value))
  name: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? null : value))
  avatar: string;

  @IsOptional()
  @IsString()
  @Length(USER_CONSTRAINTS.BIO_MIN_LENGTH, USER_CONSTRAINTS.BIO_MAX_LENGTH)
  @Transform(({ value }) => (value === '' ? null : value))
  bio: string;

  @IsOptional()
  @IsString()
  @Length(
    USER_CONSTRAINTS.ORGANIZATION_MIN_LENGTH,
    USER_CONSTRAINTS.ORGANIZATION_MAX_LENGTH,
  )
  @Transform(({ value }) => (value === '' ? null : value))
  organization: string;

  @IsOptional()
  @IsString()
  @Length(
    USER_CONSTRAINTS.JOB_TITLE_MIN_LENGTH,
    USER_CONSTRAINTS.JOB_TITLE_MAX_LENGTH,
  )
  @Transform(({ value }) => (value === '' ? null : value))
  jobTitle: string;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => UpsertUserSocialBodyDto)
  socials: UpsertUserSocialBodyDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(0)
  @ArrayMaxSize(USER_CONSTRAINTS.TAG_MAX_COUNT)
  @IsNotEmpty({ each: true })
  @Length(USER_CONSTRAINTS.TAG_MIN_LENGTH, USER_CONSTRAINTS.TAG_MAX_LENGTH, {
    each: true,
  })
  tags: string[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpsertUserLocationRequestBodyDto)
  location: UpsertUserLocationRequestBodyDto;
}
