import { DeviceType } from '@prisma/client';

export class UserAgentDto {
  constructor(
    public readonly browserName: string | null,
    public readonly browserVersion: string | null,
    public readonly osName: string | null,
    public readonly osVersion: string | null,
    public readonly platform: string | null,
    public readonly type: DeviceType,
  ) {}
}
