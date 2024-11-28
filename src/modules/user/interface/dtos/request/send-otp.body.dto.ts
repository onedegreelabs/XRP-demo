import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { OtpMethod } from '@user/interface/constants/otp.constant';

export class SendOtpRequestBodyDto {
  @IsNotEmpty()
  @IsEnum(OtpMethod)
  method: OtpMethod;

  @IsNotEmpty()
  @IsString()
  to: string;
}
