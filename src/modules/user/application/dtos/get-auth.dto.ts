import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetAuthDto {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;
}
