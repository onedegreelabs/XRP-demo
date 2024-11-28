import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CheckDuplicateEmailRequestBodyDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
