import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ENVIRONMENT_KEY_VALIDATOR } from '@config/env/variables';
import { EnvService } from '@config/env/services/env.service';

@Global()
@Module({
  imports: [ConfigModule.forRoot(ENVIRONMENT_KEY_VALIDATOR)],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
