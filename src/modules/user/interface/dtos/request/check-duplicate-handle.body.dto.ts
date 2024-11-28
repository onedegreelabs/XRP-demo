import { IsNotEmpty, IsString, Length } from 'class-validator';
import { USER_CONSTRAINTS } from '@user/interface/constants/user.constant';

export class CheckDuplicateHandleRequestBodyDto {
  @IsNotEmpty()
  @IsString()
  @Length(
    USER_CONSTRAINTS.CUSTOM_HANDLE_MIN_LENGTH,
    USER_CONSTRAINTS.CUSTOM_HANDLE_MAX_LENGTH,
  )
  handle: string;
}