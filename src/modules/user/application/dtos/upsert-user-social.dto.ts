import { Exclude, Expose } from 'class-transformer';
import { SocialType } from '@prisma/client';

@Exclude()
export class UpsertUserSocialDto {
  @Expose()
  type: SocialType;

  @Expose()
  url: string;

  @Expose()
  position: bigint;
}
