import { OpenAuthInfoDto } from '@user/interface/dtos/common/open-auth-info.dto';

export class CreateUserTokenPayloadDto {
  constructor(
    public email: string,
    public oauthInfo: OpenAuthInfoDto | null,
  ) {}
}
