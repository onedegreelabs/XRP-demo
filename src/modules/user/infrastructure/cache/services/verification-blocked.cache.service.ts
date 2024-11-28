import { Injectable } from '@nestjs/common';
import { AUTH_CONSTRAINTS } from '@user/interface/constants/auth.constant';
import { VERIFICATION_BLOCKED_KEY } from '@user/infrastructure/cache/constants/cache-key.constant';
import { CacheService } from '@cache/services/cache.service';
import { OtpMethod } from '@user/interface/constants/otp.constant';

@Injectable()
export class VerificationBlockedCacheService {
  constructor(private readonly cache: CacheService) {}

  async set(method: OtpMethod, to: string): Promise<void> {
    const key = this.cache.formatCacheKey(VERIFICATION_BLOCKED_KEY, method, to);
    await this.cache.set(key, true, AUTH_CONSTRAINTS.VERIFICATION_BLOCKED_TTL);
  }

  async get(method: OtpMethod, to: string): Promise<boolean> {
    const key = this.cache.formatCacheKey(VERIFICATION_BLOCKED_KEY, method, to);
    return await this.cache.get<boolean>(key);
  }

  async delete(method: OtpMethod, to: string): Promise<void> {
    const key = this.cache.formatCacheKey(VERIFICATION_BLOCKED_KEY, method, to);
    await this.cache.del(key);
  }
}
