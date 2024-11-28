import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { XrplNftService } from '@config/crypto/xrpl/services/xrpl-nft.service';
import {
  EVENT_TICKET_NFT_SELL_OFFER_JOB,
  EVENT_TICKET_NFT_SELL_OFFER_QUEUE,
} from '@shared/decorators/inject/queue.inject.decorator';
import { EventTicketNftService } from '@event/application/services/event-ticket-nft.service';

@Injectable()
@Processor(EVENT_TICKET_NFT_SELL_OFFER_QUEUE)
export class NftSellOfferProcessor extends WorkerHost {
  private readonly logger = new Logger(NftSellOfferProcessor.name);

  constructor(
    private readonly xrplNftService: XrplNftService,
    private readonly eventTicketNftService: EventTicketNftService,
  ) {
    super();
  }

  async process(
    job: Job<{
      userId: string;
      hostSeed: string;
      guestSeed: string;
      guestAddress: string;
      nftId: string;
      amount: number;
    }>,
  ) {
    if (job.name !== EVENT_TICKET_NFT_SELL_OFFER_JOB) return;

    const { userId, hostSeed, guestSeed, guestAddress, nftId, amount } =
      job.data;

    this.logger.log(`Processing sell offer for NFT: ${nftId}`);

    // Creates a sell offer to the guest at the ticket price specified by the host.
    const offerId = await this.xrplNftService.sellOffer(
      hostSeed,
      nftId,
      guestAddress,
      amount,
    );

    // The guest automatically accepts the host's sell offer,
    // and the ownership of the NFT is transferred from the host to the guest.
    await this.xrplNftService.acceptSellOffer(guestSeed, offerId);

    // The ownership of the NFT stored in the database are also transferred from the host to the guest.
    await this.eventTicketNftService.transferEventTicketNft(nftId, userId);

    this.logger.log(`Successfully transferred NFT: ${nftId}`);
  }
}
