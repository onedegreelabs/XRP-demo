import { Exclude, Expose } from 'class-transformer';
import { SocialType } from '@prisma/client';

@Exclude()
export class GetUserSocialResponseDto {
  @Expose()
  type: SocialType;

  @Expose()
  url: string;
}
