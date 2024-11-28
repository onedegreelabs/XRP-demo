import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { transformImageURL } from '@util/index';
import { GetUserSocialResponseDto } from '@user/interface/dtos/response/get-user-social.response.dto';
import { UserAccessLevel, UserRole } from '@prisma/client';
import { GetEventNetworkingParticipantTagDto } from '@event/application/dtos/get-event-networking-participant-tag.dto';
import { GetUserLocationResponseDto } from '@user/interface/dtos/response/get-user-location.response.dto';
import { EXPOSED_GROUPS } from '@shared/security/groups/exposed-group.enum';
import { GetUserWalletResponseDto } from '@user/interface/dtos/response/get-user-wallet.response.dto';
import { GetEventTicketNftDto } from '@event/application/dtos/get-event-ticket-nft.dto';

@Exclude()
export class GetUserProfileResponseDto {
  @Expose()
  id: string;

  @Expose()
  handle: string;

  @Expose()
  name: string;

  @Expose()
  @Transform(({ value }) => transformImageURL(value), {
    toClassOnly: true,
  })
  avatar?: string;

  @Expose({ groups: [EXPOSED_GROUPS.ME] })
  bio?: string;

  @Expose({ groups: [EXPOSED_GROUPS.ME] })
  organization?: string;

  @Expose({ groups: [EXPOSED_GROUPS.ME] })
  jobTitle?: string;

  @Expose({ groups: [EXPOSED_GROUPS.ME] })
  @Type(() => GetUserSocialResponseDto)
  socials?: GetUserSocialResponseDto[];

  @Expose({ groups: [EXPOSED_GROUPS.ME] })
  accessLevel?: UserAccessLevel;

  @Expose({ groups: [EXPOSED_GROUPS.ME] })
  role?: UserRole;

  @Expose({ groups: [EXPOSED_GROUPS.ME] })
  @Transform(
    ({ value }) => {
      if (!value) return [];
      return value
        .filter((tag: GetEventNetworkingParticipantTagDto) => tag?.tag?.name) // 유효한 객체만 필터링
        .map((tag: GetEventNetworkingParticipantTagDto) => tag.tag.name);
    },
    {
      toClassOnly: true,
    },
  )
  tags?: string[];

  @Expose({ groups: [EXPOSED_GROUPS.ME] })
  @Type(() => GetUserLocationResponseDto)
  location?: GetUserLocationResponseDto;

  @Expose({ groups: [EXPOSED_GROUPS.ME] })
  @Type(() => GetUserWalletResponseDto)
  wallet?: GetUserWalletResponseDto;

  @Expose({ groups: [EXPOSED_GROUPS.ME] })
  @Type(() => GetEventTicketNftDto)
  eventTicketNfts?: GetEventTicketNftDto[];
}
