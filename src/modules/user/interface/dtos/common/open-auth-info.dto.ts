import { ThirdPartyProvider } from '@prisma/client';

export class OpenAuthInfoDto {
  constructor(
    public readonly email: string,
    public readonly provider: ThirdPartyProvider,
    public readonly providerId: string,
    public readonly accessToken: string,
    public readonly refreshToken: string | null,
  ) {}
}
