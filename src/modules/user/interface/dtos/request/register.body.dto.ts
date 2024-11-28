import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { USER_CONSTRAINTS } from '@user/interface/constants/user.constant';
import { Transform } from 'class-transformer';
import { CreateUserDto } from '@user/application/dtos/create-user.dto';

export class RegisterRequestBodyDto implements Omit<CreateUserDto, 'handle'> {
  @IsNotEmpty()
  @IsString()
  @Length(USER_CONSTRAINTS.NAME_MIN_LENGTH, USER_CONSTRAINTS.NAME_MAX_LENGTH)
  name: string;

  @IsOptional()
  @IsString()
  avatar: string;

  @IsOptional()
  @IsString()
  @Length(USER_CONSTRAINTS.BIO_MIN_LENGTH, USER_CONSTRAINTS.BIO_MAX_LENGTH)
  @Transform(({ value }) => (value === '' ? null : value))
  bio: string;
}
