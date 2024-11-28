import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthExceptionEnum } from '@exception/enum/auth.enum';
import { UserDeviceRepository } from '@user/domain/repositories/user-device.repository';
import { AuthRepository } from '@user/domain/repositories/auth.repository';
import { AuthTokenPayloadDto } from '@user/interface/dtos/common/auth-token-payload.dto';
import { ENVIRONMENT_KEY } from '@env/variables';
import {
  JsonWebTokenError,
  JwtService,
  NotBeforeError,
  TokenExpiredError,
} from '@nestjs/jwt';
import { EnvService } from '@env/services/env.service';
import { RefreshTokenCacheService } from '@user/infrastructure/cache/services/refresh-token.cache.service';
import { UnauthorizedException } from '@exception/custom/unauthorized.exception';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(
    private readonly refreshTokenCacheService: RefreshTokenCacheService,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly userDeviceRepository: UserDeviceRepository,
    private readonly env: EnvService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const clientRtk = request.cookies.refreshToken;

    const payload = await this.verifyRefreshToken(clientRtk);
    const { email, userId, deviceId } = payload;
    const user = await this.authRepository.findByEmail(email);
    const device = await this.userDeviceRepository.findById(deviceId);
    if (!user || !device) {
      throw new UnauthorizedException(AuthExceptionEnum.InvalidTokenAccess);
    }

    const serverRtk = await this.refreshTokenCacheService.get(userId, deviceId);
    if (!serverRtk || clientRtk !== serverRtk) {
      await this.refreshTokenCacheService.delete(userId, deviceId);
      throw new UnauthorizedException(AuthExceptionEnum.InvalidTokenAccess);
    }

    request.user = payload; // Attach user to request if needed
    return true;
  }

  private async verifyRefreshToken(
    token: string,
  ): Promise<AuthTokenPayloadDto> {
    try {
      return await this.jwtService.verifyAsync<AuthTokenPayloadDto>(token, {
        secret: this.env.get<string>(ENVIRONMENT_KEY.REFRESH_TOKEN_SECRET),
      });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(AuthExceptionEnum.TokenExpiredError);
      } else if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException(AuthExceptionEnum.JsonWebTokenError);
      } else if (error instanceof NotBeforeError) {
        throw new UnauthorizedException(AuthExceptionEnum.NotBeforeError);
      } else {
        throw new UnauthorizedException(AuthExceptionEnum.InvalidToken);
      }
    }
  }
}
