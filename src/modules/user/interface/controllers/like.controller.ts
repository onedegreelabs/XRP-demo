import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { FreeMembership } from '@shared/security/roles/free-membership.role.decorator';
import { LikeFeature } from '@user/application/features/like.feature';
import { User } from '@shared/decorators/user.request.decorator';
import { AuthTokenPayloadDto } from '@user/interface/dtos/common/auth-token-payload.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserParamDto } from '@user/interface/dtos/request/user.param.dto';

@ApiTags('User')
@Controller()
@FreeMembership()
export class LikeController {
  constructor(private readonly likeFeature: LikeFeature) {}

  @Post('likes/users/:userId')
  @HttpCode(HttpStatus.OK)
  async like(
    @User() payload: AuthTokenPayloadDto,
    @Param() { userId }: UserParamDto,
  ) {
    await this.likeFeature.like(payload.userId, userId);
  }

  @Delete('likes/users/:userId')
  @HttpCode(HttpStatus.OK)
  async unlike(
    @User() payload: AuthTokenPayloadDto,
    @Param() { userId }: UserParamDto,
  ) {
    await this.likeFeature.unlike(payload.userId, userId);
  }
}
