import { ThirdPartyProvider } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateTpaDto {
  @Expose()
  provider: ThirdPartyProvider;

  @Expose()
  providerId: string;

  @Expose()
  accessToken: string;

  @Expose()
  refreshToken?: string;
}
