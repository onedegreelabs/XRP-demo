import { Injectable } from '@nestjs/common';
import { AUTH_CONSTRAINTS } from '@user/interface/constants/auth.constant';
import { CacheService } from '@cache/services/cache.service';
import { SEND_OTP_COUNT_KEY } from '@user/infrastructure/cache/constants/cache-key.constant';
import { OtpMethod } from '@user/interface/constants/otp.constant';

@Injectable()
export class SendOtpCountCacheService {
  constructor(private readonly cache: CacheService) {}

  async set(method: OtpMethod, to: string, count: number): Promise<void> {
    const key = this.cache.formatCacheKey(SEND_OTP_COUNT_KEY, method, to);
    await this.cache.set(key, count, AUTH_CONSTRAINTS.SEND_OTP_COUNT_TTL);
  }

  async increment(method: OtpMethod, to: string): Promise<void> {
    const count = await this.getNext(method, to);
    await this.set(method, to, count);
  }

  async get(method: OtpMethod, to: string): Promise<number> {
    const key = this.cache.formatCacheKey(SEND_OTP_COUNT_KEY, method, to);
    const count = await this.cache.get<number>(key);
    return count ?? 0;
  }

  async getNext(method: OtpMethod, to: string): Promise<number> {
    const count = await this.get(method, to);
    return count + 1;
  }

  async delete(method: OtpMethod, to: string): Promise<void> {
    const key = this.cache.formatCacheKey(SEND_OTP_COUNT_KEY, method, to);
    await this.cache.del(key);
  }
}
