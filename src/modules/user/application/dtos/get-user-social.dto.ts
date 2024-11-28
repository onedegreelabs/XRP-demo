import { Exclude, Expose } from 'class-transformer';
import { SocialType } from '@prisma/client';

@Exclude()
export class GetUserSocialDto {
  @Expose()
  id?: string;

  @Expose()
  type: SocialType;

  @Expose()
  url: string;
}
