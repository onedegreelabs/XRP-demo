import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateUserDto {
  @Expose()
  handle: string;

  @Expose()
  name: string;

  @Expose()
  avatar: string;

  @Expose()
  bio?: string;
}
