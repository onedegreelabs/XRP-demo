import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserGuard } from '@user/application/security/guards/create-user.guard';
import { CreateUserTokenPayloadDto } from '@user/interface/dtos/common/create-user-token-payload.dto';
import { UserAgent } from '@shared/decorators/user-agent.request.decorator';
import { UserAgentDto } from '@user/interface/dtos/common/user-agent.dto';
import { RegisterRequestBodyDto } from '@user/interface/dtos/request/register.body.dto';
import { Response } from 'express';
import { UserFeature } from '@user/application/features/user.feature';
import { AuthTokenCookieService } from '@user/infrastructure/cookie/services/auth-token.cookie';
import { ApiTags } from '@nestjs/swagger';
import { UserAvatarUpload } from '@shared/decorators/user-avatar.multer.decorator';
import { USER_CONSTRAINTS } from '@user/interface/constants/user.constant';
import { plainToInstance } from 'class-transformer';
import { File } from '@shared/decorators/file.request.decorator';
import { Auth } from '@shared/decorators/auth.request.decorator';
import { CheckDuplicateHandleRequestBodyDto } from '@user/interface/dtos/request/check-duplicate-handle.body.dto';
import { CheckDuplicateEmailRequestBodyDto } from '@user/interface/dtos/request/check-duplicate-email.body.dto';
import { GetS3KeyResponseDto } from '@shared/dtos/response/get-s3-key.response.dto';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(
    private readonly userFeature: UserFeature,
    private readonly authTokenCookieService: AuthTokenCookieService,
  ) {}

  @Post()
  @UseGuards(CreateUserGuard)
  @HttpCode(HttpStatus.OK)
  async register(
    @Auth() payload: CreateUserTokenPayloadDto,
    @UserAgent() userAgent: UserAgentDto,
    @Ip() ip: string,
    @Body() registerRequestBodyDto: RegisterRequestBodyDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const tokens = await this.userFeature.register(
      ip,
      userAgent,
      payload,
      registerRequestBodyDto,
    );
    await this.authTokenCookieService.set(response, tokens);
  }

  @Post('avatar')
  @UserAvatarUpload()
  @HttpCode(HttpStatus.OK)
  async uploadAvatar(
    @File(USER_CONSTRAINTS.AVATAR_FILE_KEY) image: Express.MulterS3.File,
  ): Promise<GetS3KeyResponseDto> {
    return plainToInstance(GetS3KeyResponseDto, {
      url: image.key ?? null,
      key: image.key ?? null,
    });
  }

  @Post('check-duplicate-handle')
  @HttpCode(HttpStatus.OK)
  async checkDuplicateUserHandle(
    @Body() { handle }: CheckDuplicateHandleRequestBodyDto,
  ): Promise<void> {
    await this.userFeature.checkDuplicateHandle(handle);
  }

  @Post('check-duplicate-email')
  @HttpCode(HttpStatus.OK)
  async checkDuplicateUserEmail(
    @Body() { email }: CheckDuplicateEmailRequestBodyDto,
  ): Promise<void> {
    await this.userFeature.checkDuplicateEmail(email);
  }
}
