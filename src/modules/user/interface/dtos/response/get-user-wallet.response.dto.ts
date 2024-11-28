import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetUserWalletResponseDto {
  @Expose()
  id: string;

  @Expose()
  address: string;

  @Expose()
  seed: string;

  @Expose()
  balance: string;
}
