import { IsNotEmpty, IsString } from 'class-validator';

export class UserDeviceParamDto {
  @IsNotEmpty()
  @IsString()
  deviceId: string;
}
