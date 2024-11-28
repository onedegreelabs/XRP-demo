import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EnvService } from '@env/services/env.service';
import { EnvModule } from '@env/env.module';
import { ENVIRONMENT_KEY } from '@env/variables';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [EnvModule],
      useFactory: async (envService: EnvService) => {
        return {
          connection: {
            url: envService.get<string>(ENVIRONMENT_KEY.REDIS_URL),
          },
        };
      },
      inject: [EnvService],
    }),
  ],
})
export class QueueModule {}
