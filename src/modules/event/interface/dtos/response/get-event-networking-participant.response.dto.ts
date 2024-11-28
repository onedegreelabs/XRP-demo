import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { GetEventNetworkingParticipantSocialResponseDto } from '@event/interface/dtos/response/get-event-networking-participant-social.response.dto';
import { GetEventNetworkingParticipantTagDto } from '@event/application/dtos/get-event-networking-participant-tag.dto';
import { EXPOSED_GROUPS } from '@shared/security/groups/exposed-group.enum';

@Exclude()
export class GetEventNetworkingParticipantResponseDto {
  @Expose({
    groups: [
      EXPOSED_GROUPS.EVENT_MANAGER,
      EXPOSED_GROUPS.EVENT_NETWORKING_PARTICIPANT,
    ],
  })
  bio?: string;

  @Expose({
    groups: [
      EXPOSED_GROUPS.EVENT_MANAGER,
      EXPOSED_GROUPS.EVENT_NETWORKING_PARTICIPANT,
    ],
  })
  organization?: string;

  @Expose({
    groups: [
      EXPOSED_GROUPS.EVENT_MANAGER,
      EXPOSED_GROUPS.EVENT_NETWORKING_PARTICIPANT,
    ],
  })
  jobTitle?: string;

  @Expose({
    groups: [
      EXPOSED_GROUPS.EVENT_MANAGER,
      EXPOSED_GROUPS.EVENT_NETWORKING_PARTICIPANT,
    ],
  })
  @Type(() => GetEventNetworkingParticipantSocialResponseDto)
  socials?: GetEventNetworkingParticipantSocialResponseDto[];

  @Expose({
    groups: [
      EXPOSED_GROUPS.EVENT_MANAGER,
      EXPOSED_GROUPS.EVENT_NETWORKING_PARTICIPANT,
    ],
  })
  @Transform(({ value }) => {
    if (!value) return [];
    return value
      .filter((tag: GetEventNetworkingParticipantTagDto) => tag?.tag?.name) // 유효한 객체만 필터링
      .map((tag: GetEventNetworkingParticipantTagDto) => tag.tag.name);
  })
  tags?: string[];
}
