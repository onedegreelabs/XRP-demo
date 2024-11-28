import { Exclude, Expose } from 'class-transformer';
import { ThirdPartyProvider } from '@prisma/client';

@Exclude()
export class GetTpaDto {
  @Expose()
  id: string;

  @Expose()
  userId?: string;

  @Expose()
  provider: ThirdPartyProvider;

  @Expose()
  providerId?: string;

  @Expose()
  accessToken?: string;

  @Expose()
  refreshToken?: string;

  @Expose()
  linkedAt: Date;
}
