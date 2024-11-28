import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { EnvModule } from '@env/env.module';
import { CacheManagerConfig } from '@cache/cache-manager/cache-manager.config';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [EnvModule],
      useClass: CacheManagerConfig,
    }),
  ],
})
export class CacheManagerModule {}
