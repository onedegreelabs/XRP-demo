import { Injectable } from '@nestjs/common';
import { CookieOptions, Response } from 'express';
import { GetAuthTokensDto } from '@user/application/dtos/get-auth-tokens.dto';
import { ENVIRONMENT_KEY } from '@env/variables';
import { EnvService } from '@env/services/env.service';

@Injectable()
export class AuthTokenCookieService {
  constructor(private readonly env: EnvService) {}

  async set(response: Response, tokens: GetAuthTokensDto): Promise<void> {
    response.cookie(
      'accessToken',
      tokens.accessToken,
      this.getCookieOptions(
        this.env.get<number>(ENVIRONMENT_KEY.ACCESS_TOKEN_TTL) * 1000,
      ),
    );

    response.cookie(
      'refreshToken',
      tokens.refreshToken,
      this.getCookieOptions(
        this.env.get<number>(ENVIRONMENT_KEY.REFRESH_TOKEN_TTL) * 1000,
      ),
    );
  }

  async clear(response: Response): Promise<void> {
    response.clearCookie('accessToken', this.getCookieOptions(0));
    response.clearCookie('refreshToken', this.getCookieOptions(0));
  }

  private getCookieOptions(maxAge: number): CookieOptions {
    return {
      path: '/',
      httpOnly: true,
      maxAge,
      secure: true,
      sameSite: 'none',
    };
  }
}
