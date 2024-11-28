import { Injectable } from '@nestjs/common';
import { CacheModuleOptions, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { CacheOptionsFactory } from '@nestjs/cache-manager/dist/interfaces/cache-module.interface';
import { EnvService } from '@env/services/env.service';
import { ENVIRONMENT_KEY } from '@env/variables';
import { InternalServerErrorException } from '@exception/custom/internal-server-error.exception';
import { GlobalExceptionEnum } from '@exception/enum/global.enum';

@Injectable()
export class CacheManagerConfig implements CacheOptionsFactory {
  constructor(private readonly env: EnvService) {}

  public async createCacheOptions(): Promise<CacheModuleOptions> {
    try {
      if (this.env.isProduction()) {
        return await this.productionOpts();
      }
      if (this.env.isLocal()) {
        return await this.localOpts();
      }
      if (this.env.isDevelopment()) {
        return await this.developmentOpts();
      }
      if (this.env.isTest()) {
        return await this.localOpts();
      }
    } catch (error) {
      throw new InternalServerErrorException(
        GlobalExceptionEnum.CacheStorageConnectionTimeoutError,
      );
    }
  }

  /**
   * - 배포 환경에서 redis storage를 사용합니다.
   * - AWS Elasticache를 사용합니다. (개발 환경에서는 사용할 수 없습니다.)
   * - `npm run start:prod` 명령어를 통해 실행됩니다.
   */
  private async productionOpts(): Promise<CacheModuleOptions> {
    return {
      store: (await redisStore({
        url: this.env.get<string>(ENVIRONMENT_KEY.REDIS_URL),
        ttl: Number(this.env.get<number>(ENVIRONMENT_KEY.CACHE_TTL)),
        store: undefined,
      })) as unknown as CacheStore,
    };
  }

  /**
   * - 로컬 환경에서 redis storage를 사용합니다.
   * - Redis를 설치하거나 Docker를 사용하여 Redis 컨테이너를 실행해야 합니다.
   * - `npm run start:local` 명령어를 통해 실행됩니다.
   */
  private async localOpts(): Promise<CacheModuleOptions> {
    return {
      store: (await redisStore({
        url: `redis://localhost:6379`,
        ttl: Number(this.env.get<number>(ENVIRONMENT_KEY.CACHE_TTL)),
        store: undefined,
      })) as unknown as CacheStore,
    };
  }

  /**
   * - 일반적으로, 개발 환경에서는 memory storage를 사용합니다.
   * - `npm run start:dev` 명령어를 통해 실행됩니다.
   */
  private async developmentOpts(): Promise<CacheModuleOptions> {
    return {
      max: 100,
      ttl: Number(this.env.get<number>(ENVIRONMENT_KEY.CACHE_TTL)),
    };
  }
}
