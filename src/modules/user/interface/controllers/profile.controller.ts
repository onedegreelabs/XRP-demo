import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Query,
} from '@nestjs/common';
import { FreeMembership } from '@shared/security/roles/free-membership.role.decorator';
import { User } from '@shared/decorators/user.request.decorator';
import { AuthTokenPayloadDto } from '@user/interface/dtos/common/auth-token-payload.dto';
import { UpdateProfileRequestBodyDto } from '@user/interface/dtos/request/update-profile.body.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserProfileFeature } from '@user/application/features/user-profile.feature';
import { GetUserProfileResponseDto } from '@user/interface/dtos/response/get-user-profile.response.dto';
import { UserHandleQueryDto } from '@user/interface/dtos/request/user-handle.query.dto';
import { EXPOSED_GROUPS } from '@shared/security/groups/exposed-group.enum';
import { ExposedGroup } from '@shared/security/groups/exposed-group.decorator';

@ApiTags('User')
@Controller()
@FreeMembership()
export class ProfileController {
  constructor(private readonly userProfileFeature: UserProfileFeature) {}

  @Get('users/profile')
  @HttpCode(HttpStatus.OK)
  async getUserProfileByHandle(
    @Query() { handle }: UserHandleQueryDto,
  ): Promise<GetUserProfileResponseDto> {
    return this.userProfileFeature.getUserProfileByHandle(handle);
  }

  @Get('me/profile')
  @ExposedGroup([EXPOSED_GROUPS.ME])
  @HttpCode(HttpStatus.OK)
  async getMyProfile(
    @User() payload: AuthTokenPayloadDto,
  ): Promise<GetUserProfileResponseDto> {
    return this.userProfileFeature.getMyProfile(payload.userId);
  }

  @Patch('me/profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @User() payload: AuthTokenPayloadDto,
    @Body() updateProfileRequestBodyDto: UpdateProfileRequestBodyDto,
  ): Promise<void> {
    await this.userProfileFeature.updateProfile(
      payload.userId,
      updateProfileRequestBodyDto,
    );
  }

  @Get('me/likes/users')
  @HttpCode(HttpStatus.OK)
  async getMyLikedUserList(
    @User() payload: AuthTokenPayloadDto,
  ): Promise<GetUserProfileResponseDto[]> {
    return await this.userProfileFeature.getMyLikedUserList(payload.userId);
  }
}
