import { Injectable } from '@nestjs/common';
import { ENVIRONMENT_KEY } from '@env/variables';
import { REFRESH_TOKEN_KEY } from '@user/infrastructure/cache/constants/cache-key.constant';
import { EnvService } from '@env/services/env.service';
import { CacheService } from '@cache/services/cache.service';

@Injectable()
export class RefreshTokenCacheService {
  constructor(
    private readonly cache: CacheService,
    private readonly env: EnvService,
  ) {}

  async set(userId: string, deviceId: string, token: string): Promise<void> {
    const key = this.cache.formatCacheKey(
      REFRESH_TOKEN_KEY,
      userId.toString(),
      deviceId,
    );
    const ttl = this.env.get<number>(ENVIRONMENT_KEY.REFRESH_TOKEN_TTL);
    await this.cache.set(key, token, ttl);
  }

  async get(userId: string, deviceId: string): Promise<string> {
    const key = this.cache.formatCacheKey(
      REFRESH_TOKEN_KEY,
      userId.toString(),
      deviceId,
    );
    return await this.cache.get<string>(key);
  }

  async delete(userId: string, deviceId: string): Promise<void> {
    const key = this.cache.formatCacheKey(
      REFRESH_TOKEN_KEY,
      userId.toString(),
      deviceId,
    );
    await this.cache.del(key);
  }
}
