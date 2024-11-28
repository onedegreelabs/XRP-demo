import { UserAccessLevel, UserRole } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { GetUserLocationDto } from '@user/application/dtos/get-user-location.dto';
import { GetUserSocialDto } from '@user/application/dtos/get-user-social.dto';
import { GetUserTagDto } from '@user/application/dtos/get-user-tag.dto';
import { GetEventTicketNftDto } from '@event/application/dtos/get-event-ticket-nft.dto';

@Exclude()
export class GetUserDto {
  @Expose()
  id: string;

  @Expose()
  handle: string;

  @Expose()
  name: string;

  @Expose()
  avatar: string;

  @Expose()
  bio?: string;

  @Expose()
  organization?: string;

  @Expose()
  jobTitle?: string;

  @Expose()
  accessLevel?: UserAccessLevel;

  @Expose()
  role?: UserRole;

  @Expose()
  @Type(() => GetUserLocationDto)
  location?: GetUserLocationDto;

  @Expose()
  @Type(() => GetUserSocialDto)
  socials?: GetUserSocialDto[];

  @Expose()
  @Type(() => GetUserTagDto)
  tags?: GetUserTagDto[];

  @Expose()
  @Type(() => GetEventTicketNftDto)
  eventTicketNfts?: GetEventTicketNftDto[];
}
