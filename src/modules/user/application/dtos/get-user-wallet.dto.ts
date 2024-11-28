import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetUserWalletDto {
  @Expose()
  id: string;

  @Expose()
  address: string;

  @Expose()
  seed: string;
}
