import { Module } from '@nestjs/common';
import { XrplService } from '@config/crypto/xrpl/services/xrpl.service';
import { XrplWalletService } from '@config/crypto/xrpl/services/xrpl-wallet.service';
import { XrplNftService } from '@config/crypto/xrpl/services/xrpl-nft.service';
import { XrplTicketService } from '@config/crypto/xrpl/services/xrpl-ticket.service';

@Module({
  imports: [],
  providers: [
    XrplService,
    XrplWalletService,
    XrplNftService,
    XrplTicketService,
  ],
  exports: [XrplService, XrplWalletService, XrplNftService, XrplTicketService],
})
export class XrplModule {}
