import { Exclude, Expose, Type } from 'class-transformer';
import {
  EventHostAccessLevel,
  EventHostInvitationStatus,
} from '@prisma/client';
import { EXPOSED_GROUPS } from '@shared/security/groups/exposed-group.enum';
import { GetUserProfileResponseDto } from '@user/interface/dtos/response/get-user-profile.response.dto';

@Exclude()
export class GetEventHostResponseDto {
  @Expose()
  id: string;

  @Expose({
    groups: [EXPOSED_GROUPS.EVENT_MANAGER],
  })
  email?: string;

  @Expose({
    groups: [EXPOSED_GROUPS.EVENT_MANAGER],
  })
  accessLevel?: EventHostAccessLevel;

  @Expose({
    groups: [EXPOSED_GROUPS.EVENT_MANAGER],
  })
  invitationStatus?: EventHostInvitationStatus;

  @Expose({
    groups: [EXPOSED_GROUPS.EVENT_MANAGER],
  })
  listingEnabled?: boolean;

  @Expose({
    groups: [EXPOSED_GROUPS.EVENT_MANAGER],
  })
  createdAt: Date;

  @Expose({
    groups: [EXPOSED_GROUPS.EVENT_MANAGER],
  })
  invitedAt: Date;

  @Expose()
  @Type(() => GetUserProfileResponseDto)
  user: GetUserProfileResponseDto;
}
