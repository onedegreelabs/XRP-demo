import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetTagDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
