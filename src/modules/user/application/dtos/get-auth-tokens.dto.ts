import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetAuthTokensDto {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}
