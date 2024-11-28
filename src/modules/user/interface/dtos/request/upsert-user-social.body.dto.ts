import { SocialType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsUrl } from 'class-validator';
import { UpsertUserSocialDto } from '@user/application/dtos/upsert-user-social.dto';

export class UpsertUserSocialBodyDto
  implements Omit<UpsertUserSocialDto, 'position'>
{
  @IsNotEmpty()
  @IsEnum(SocialType)
  type: SocialType;

  @IsNotEmpty()
  @IsUrl()
  url: string;
}
