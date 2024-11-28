import { Body, Controller, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { UserFeature } from '@user/application/features/user.feature';
import { ApiTags } from '@nestjs/swagger';
import { FreeMembership } from '@shared/security/roles/free-membership.role.decorator';
import { User } from '@shared/decorators/user.request.decorator';
import { AuthTokenPayloadDto } from '@user/interface/dtos/common/auth-token-payload.dto';
import { UpdateUserHandleRequestBodyDto } from '@user/interface/dtos/request/update-user-handle.body.dto';

@ApiTags('User')
@Controller('me')
@FreeMembership()
export class MySettingsController {
  constructor(private readonly userFeature: UserFeature) {}

  @Patch('handle')
  @HttpCode(HttpStatus.OK)
  async updateMyHandle(
    @User() payload: AuthTokenPayloadDto,
    @Body() { handle }: UpdateUserHandleRequestBodyDto,
  ): Promise<void> {
    await this.userFeature.updateHandle(payload.userId, handle);
  }
}
