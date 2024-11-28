import { Exclude, Expose, Type } from 'class-transformer';
import { GetTagDto } from '@user/application/dtos/get-tag.dto';

@Exclude()
export class GetEventNetworkingParticipantTagDto {
  @Expose()
  id: string;

  @Expose()
  networkingParticipantId: string;

  @Expose()
  tagId: string;

  @Expose()
  position: bigint;

  @Expose()
  @Type(() => GetTagDto)
  tag?: GetTagDto;
}
