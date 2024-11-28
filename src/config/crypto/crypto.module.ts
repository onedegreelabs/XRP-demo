import { Module } from '@nestjs/common';
import { XrplModule } from '@config/crypto/xrpl/xrpl.module';

@Module({
  imports: [XrplModule],
})
export class CryptoModule {}
