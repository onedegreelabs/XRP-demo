import { DeviceType } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateUserDeviceDto {
  @Expose()
  ip: string;

  @Expose()
  region?: string;

  @Expose()
  browserName?: string;

  @Expose()
  browserVersion?: string;

  @Expose()
  osName?: string;

  @Expose()
  osVersion?: string;

  @Expose()
  platform?: string;

  @Expose()
  type: DeviceType;
}
