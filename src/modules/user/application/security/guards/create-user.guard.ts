import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthExceptionEnum } from '@exception/enum/auth.enum';
import { UnauthorizedException } from '@exception/custom/unauthorized.exception';
import { CreateUserTokenPayloadDto } from '@user/interface/dtos/common/create-user-token-payload.dto';
import { ENVIRONMENT_KEY } from '@env/variables';
import {
  JsonWebTokenError,
  JwtService,
  NotBeforeError,
  TokenExpiredError,
} from '@nestjs/jwt';
import { EnvService } from '@env/services/env.service';

@Injectable()
export class CreateUserGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly env: EnvService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(AuthExceptionEnum.TokenNotFound);
    }

    const createUserToken = authHeader.split(' ')[1];

    request.auth = await this.verifyCreateUserToken(createUserToken); // Attach email to request if needed
    return true;
  }

  private async verifyCreateUserToken(
    token: string,
  ): Promise<CreateUserTokenPayloadDto> {
    try {
      return await this.jwtService.verifyAsync<CreateUserTokenPayloadDto>(
        token,
        {
          secret: this.env.get<string>(
            ENVIRONMENT_KEY.CREATE_USER_TOKEN_SECRET,
          ),
        },
      );
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
