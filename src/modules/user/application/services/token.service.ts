import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AuthTokenPayloadDto } from '@user/interface/dtos/common/auth-token-payload.dto';
import { GetUserDto } from '@user/application/dtos/get-user.dto';
import { GetUserDeviceDto } from '@user/application/dtos/get-user-device.dto';
import { GetCreateUserTokenDto } from '@user/application/dtos/get-create-user-token.dto';
import { CreateUserTokenPayloadDto } from '@user/interface/dtos/common/create-user-token-payload.dto';
import { ENVIRONMENT_KEY } from '@env/variables';
import { UnauthorizedException } from '@exception/custom/unauthorized.exception';
import { AuthExceptionEnum } from '@exception/enum/auth.enum';
import { JwtService } from '@nestjs/jwt';
import { EnvService } from '@env/services/env.service';
import { GetAuthTokensDto } from '@user/application/dtos/get-auth-tokens.dto';
import { RefreshTokenCacheService } from '@user/infrastructure/cache/services/refresh-token.cache.service';
import { OpenAuthInfoDto } from '@user/interface/dtos/common/open-auth-info.dto';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly refreshTokenCacheService: RefreshTokenCacheService,
    private readonly env: EnvService,
  ) {}

  async createAuthToken(
    email: string,
    getUserDto: GetUserDto,
    getUserDeviceDto: GetUserDeviceDto,
  ): Promise<GetAuthTokensDto> {
    const payload = plainToInstance(AuthTokenPayloadDto, {
      userId: getUserDto.id,
      deviceId: getUserDeviceDto.id,
      email,
      name: getUserDto.name,
      accessLevel: getUserDto.accessLevel,
      role: getUserDto.role,
    });
    const accessToken = await this.signAccessToken(payload);
    const refreshToken = await this.signRefreshToken(payload);

    await this.refreshTokenCacheService.set(
      payload.userId,
      payload.deviceId,
      refreshToken,
    );

    return plainToInstance(GetAuthTokensDto, { accessToken, refreshToken });
  }

  async deleteAuthToken(payload: AuthTokenPayloadDto) {
    await this.refreshTokenCacheService.delete(
      payload.userId,
      payload.deviceId,
    );
  }

  async createCreateUserToken(
    email: string,
    oauthInfo: OpenAuthInfoDto,
  ): Promise<GetCreateUserTokenDto> {
    const payload = plainToInstance(CreateUserTokenPayloadDto, {
      email,
      oauthInfo,
    });
    return plainToInstance(GetCreateUserTokenDto, {
      createUserToken: await this.signCreateUserToken(payload),
    });
  }

  async signAccessToken(payload: AuthTokenPayloadDto): Promise<string> {
    try {
      return await this.jwtService.signAsync(
        { ...payload },
        {
          secret: this.env.get<string>(ENVIRONMENT_KEY.ACCESS_TOKEN_SECRET),
          expiresIn: `${this.env.get<number>(
            ENVIRONMENT_KEY.ACCESS_TOKEN_TTL,
          )}s`,
        },
      );
    } catch (error) {
      throw new UnauthorizedException(AuthExceptionEnum.FailedToIssueToken);
    }
  }

  async signRefreshToken(payload: AuthTokenPayloadDto): Promise<string> {
    try {
      return await this.jwtService.signAsync(
        { ...payload },
        {
          secret: this.env.get<string>(ENVIRONMENT_KEY.REFRESH_TOKEN_SECRET),
          expiresIn: `${this.env.get<number>(
            ENVIRONMENT_KEY.REFRESH_TOKEN_TTL,
          )}s`,
        },
      );
    } catch (error) {
      throw new UnauthorizedException(AuthExceptionEnum.FailedToIssueToken);
    }
  }

  async signCreateUserToken(
    payload: CreateUserTokenPayloadDto,
  ): Promise<string> {
    try {
      return await this.jwtService.signAsync(
        { ...payload },
        {
          secret: this.env.get<string>(
            ENVIRONMENT_KEY.CREATE_USER_TOKEN_SECRET,
          ),
          expiresIn: `${this.env.get<number>(
            ENVIRONMENT_KEY.CREATE_USER_TOKEN_TTL,
          )}s`,
        },
      );
    } catch (error) {
      throw new UnauthorizedException(AuthExceptionEnum.FailedToIssueToken);
    }
  }
}
