import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { GetTagDto } from '@user/application/dtos/get-tag.dto';

@Exclude()
export class GetUserTagDto {
  @Expose()
  userId: string;

  @Expose()
  tagId: string;

  @Expose()
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  position: bigint;

  @Expose()
  @Type(() => GetTagDto)
  tag: GetTagDto;
}
