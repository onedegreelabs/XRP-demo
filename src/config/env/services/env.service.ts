import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENVIRONMENT_KEY } from '@env/variables';

@Injectable()
export class EnvService {
  constructor(
    private readonly configService: ConfigService<typeof ENVIRONMENT_KEY, true>,
  ) {}

  get<T>(key: (typeof ENVIRONMENT_KEY)[keyof typeof ENVIRONMENT_KEY]): T {
    return this.configService.get<T>(key);
  }

  isLocal(): boolean {
    return this.get<string>(ENVIRONMENT_KEY.NODE_ENV) === 'local';
  }

  isDevelopment(): boolean {
    return this.get<string>(ENVIRONMENT_KEY.NODE_ENV) === 'development';
  }

  isProduction(): boolean {
    return this.get<string>(ENVIRONMENT_KEY.NODE_ENV) === 'production';
  }

  isTest(): boolean {
    return this.get<string>(ENVIRONMENT_KEY.NODE_ENV) === 'test';
  }
}
