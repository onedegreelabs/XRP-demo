import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthExceptionEnum } from '@exception/enum/auth.enum';
import { PrismaService } from '@persistence/prisma/prisma.service';
import { AuthTokenPayloadDto } from '@user/interface/dtos/common/auth-token-payload.dto';
import { ENVIRONMENT_KEY } from '@env/variables';
import {
  JsonWebTokenError,
  JwtService,
  NotBeforeError,
  TokenExpiredError,
} from '@nestjs/jwt';
import { EnvService } from '@env/services/env.service';
import { UnauthorizedException } from '@exception/custom/unauthorized.exception';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly env: EnvService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.cookies.accessToken;

    if (!accessToken) {
      throw new UnauthorizedException(AuthExceptionEnum.TokenNotFound);
    }

    const payload = await this.verifyAccessToken(accessToken);
    const { email, deviceId } = payload;
    if (!email || !deviceId) {
      throw new UnauthorizedException(AuthExceptionEnum.InvalidTokenAccess);
    }

    const user = await this.prisma.auth.findUnique({ where: { email } });
    const device = await this.prisma.userDevice.findUnique({
      where: { id: deviceId },
    });
    if (!user || !device) {
      throw new UnauthorizedException(AuthExceptionEnum.InvalidTokenAccess);
    }

    request.user = payload; // 사용자 정보를 요청 객체에 추가
    return true;
  }

  private async verifyAccessToken(token: string): Promise<AuthTokenPayloadDto> {
    try {
      return await this.jwtService.verifyAsync<AuthTokenPayloadDto>(token, {
        secret: this.env.get<string>(ENVIRONMENT_KEY.ACCESS_TOKEN_SECRET),
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
