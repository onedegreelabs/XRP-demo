import { DeviceType } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetUserDeviceDto {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  type: DeviceType;

  @Expose()
  browserName: string;

  @Expose()
  browserVersion: string;

  @Expose()
  osName: string;

  @Expose()
  osVersion: string;

  @Expose()
  platform: string;

  @Expose()
  ip: string;

  @Expose()
  region: string;

  @Expose()
  lastLoginAt: Date;
}
