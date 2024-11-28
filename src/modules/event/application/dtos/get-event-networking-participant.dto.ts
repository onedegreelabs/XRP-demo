import { Exclude, Expose, Type } from 'class-transformer';
import { GetEventNetworkingParticipantSocialDto } from '@event/application/dtos/get-event-networking-participant-social.dto';
import { GetEventNetworkingParticipantTagDto } from '@event/application/dtos/get-event-networking-participant-tag.dto';

@Exclude()
export class GetEventNetworkingParticipantDto {
  @Expose()
  id: string;

  @Expose()
  bio: string;

  @Expose()
  organization: string;

  @Expose()
  jobTitle: string;

  @Expose()
  @Type(() => GetEventNetworkingParticipantSocialDto)
  socials?: GetEventNetworkingParticipantSocialDto[];

  @Expose()
  @Type(() => GetEventNetworkingParticipantTagDto)
  tags?: GetEventNetworkingParticipantTagDto[];
}
