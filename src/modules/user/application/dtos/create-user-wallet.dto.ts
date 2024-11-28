import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateUserWalletDto {
  @Expose()
  address: string;

  @Expose()
  seed: string;
}
