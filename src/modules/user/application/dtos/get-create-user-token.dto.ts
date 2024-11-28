import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetCreateUserTokenDto {
  @Expose()
  createUserToken: string;
}
