import { IsNotEmpty, IsString, Length } from 'class-validator';
import { USER_CONSTRAINTS } from '@user/interface/constants/user.constant';
import { UpdateUserDto } from '@user/application/dtos/update-user.dto';

export class UpdateUserHandleRequestBodyDto
  implements Pick<UpdateUserDto, 'handle'>
{
  @IsNotEmpty()
  @IsString()
  @Length(
    USER_CONSTRAINTS.CUSTOM_HANDLE_MIN_LENGTH,
    USER_CONSTRAINTS.CUSTOM_HANDLE_MAX_LENGTH,
  )
  handle: string;
}
