import { Global, Module } from '@nestjs/common';
import { EnvModule } from '@env/env.module';
import { AwsS3Service } from '@persistence/s3/aws-s3.service';

@Global()
@Module({
  imports: [EnvModule],
  providers: [AwsS3Service],
  exports: [AwsS3Service],
})
export class AwsS3Module {}
