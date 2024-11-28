import { Exclude, Expose } from 'class-transformer';
import { SocialType } from '@prisma/client';
import { EXPOSED_GROUPS } from '@shared/security/groups/exposed-group.enum';

@Exclude()
export class GetEventNetworkingParticipantSocialResponseDto {
  @Expose({
    groups: [
      EXPOSED_GROUPS.EVENT_MANAGER,
      EXPOSED_GROUPS.EVENT_NETWORKING_PARTICIPANT,
    ],
  })
  type?: SocialType;

  @Expose({
    groups: [
      EXPOSED_GROUPS.EVENT_MANAGER,
      EXPOSED_GROUPS.EVENT_NETWORKING_PARTICIPANT,
    ],
  })
  url?: string;
}
