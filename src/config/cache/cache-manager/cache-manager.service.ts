import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InternalServerErrorException } from '@exception/custom/internal-server-error.exception';
import { GlobalExceptionEnum } from '@exception/enum/global.enum';
import { CacheService } from '@cache/services/cache.service';

@Injectable()
export class CacheManagerService implements CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    try {
      return this.cacheManager.get<T>(key);
    } catch (error) {
      throw new InternalServerErrorException(
        GlobalExceptionEnum.CacheClientRequestError,
      );
    }
  }

  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, { ttl });
    } catch (error) {
      throw new InternalServerErrorException(
        GlobalExceptionEnum.CacheClientRequestError,
      );
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (error) {
      throw new InternalServerErrorException(
        GlobalExceptionEnum.CacheClientRequestError,
      );
    }
  }

  formatCacheKey(key: string, ...params: string[]): string {
    // key에 있는 {1},{2},...,{N} 등의 숫자를 찾음
    const matches = key.match(/{\d+}/g);

    // key에 {N}로 구분된 것이 없으면 바로 key 반환
    if (!matches) return key;

    // params의 개수와 {N}로 구분된 것의 개수가 일치하는지 확인
    if (matches.length !== params.length) {
      throw new InternalServerErrorException(
        GlobalExceptionEnum.CacheKeyPlaceholderMismatchError,
      );
    }

    // {1},{2},...,{N} 순서대로 params 값을 대체
    return key.replace(/{(\d+)}/g, (match, index) => {
      const paramIndex = parseInt(index) - 1;
      if (paramIndex >= params.length || paramIndex < 0) {
        throw new InternalServerErrorException(
          GlobalExceptionEnum.CacheKeyPlaceholderIndexError,
        );
      }
      return params[paramIndex];
    });
  }
}
