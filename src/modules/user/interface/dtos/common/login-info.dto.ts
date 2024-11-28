import { UserAgentDto } from '@user/interface/dtos/common/user-agent.dto';
import { OpenAuthInfoDto } from '@user/interface/dtos/common/open-auth-info.dto';

export class LoginInfoDto {
  constructor(
    public readonly email: string,
    public readonly ip: string,
    public readonly userAgent: UserAgentDto,
    public readonly oauthInfo?: OpenAuthInfoDto,
  ) {}
}
