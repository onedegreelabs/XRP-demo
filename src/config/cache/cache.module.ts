import { Global, Module } from '@nestjs/common';
import { CacheManagerModule } from '@cache/cache-manager/cache-manager.module';
import { CacheManagerService } from '@cache/cache-manager/cache-manager.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpCacheInterceptor } from '@interceptor/http-cache.interceptor';
import { CacheService } from '@cache/services/cache.service';

@Global()
@Module({
  imports: [CacheManagerModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
    {
      provide: CacheService,
      useClass: CacheManagerService,
    },
  ],
  exports: [
    {
      provide: CacheService,
      useClass: CacheManagerService,
    },
  ],
})
export class CacheModule {}
