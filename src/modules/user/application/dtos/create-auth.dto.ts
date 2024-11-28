import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateAuthDto {
  @Expose()
  email: string;
}
