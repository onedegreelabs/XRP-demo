import { Injectable } from '@nestjs/common';
import { AUTH_CONSTRAINTS } from '@user/interface/constants/auth.constant';
import { CacheService } from '@cache/services/cache.service';
import { OTP_KEY } from '@user/infrastructure/cache/constants/cache-key.constant';
import { OtpMethod } from '@user/interface/constants/otp.constant';

@Injectable()
export class OtpCacheService {
  constructor(private readonly cache: CacheService) {}

  async set(method: OtpMethod, to: string, code: number): Promise<void> {
    const key = this.cache.formatCacheKey(OTP_KEY, method, to);
    await this.cache.set(key, code, AUTH_CONSTRAINTS.OTP_TTL);
  }

  async get(method: OtpMethod, to: string): Promise<number> {
    const key = this.cache.formatCacheKey(OTP_KEY, method, to);
    return await this.cache.get<number>(key);
  }

  async delete(method: OtpMethod, to: string): Promise<void> {
    const key = this.cache.formatCacheKey(OTP_KEY, method, to);
    await this.cache.del(key);
  }
}
