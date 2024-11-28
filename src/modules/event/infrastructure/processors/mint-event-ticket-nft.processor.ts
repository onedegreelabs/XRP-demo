import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { XrplNftService } from '@config/crypto/xrpl/services/xrpl-nft.service';
import { EventTicketNftRepository } from '@event/domain/repositories/event-ticket-nft.repository';
import {
  EVENT_TICKET_NFT_JOB,
  EVENT_TICKET_NFT_QUEUE,
} from '@shared/decorators/inject/queue.inject.decorator';
import { UserWalletRepository } from '@user/domain/repositories/user-wallet.repository';
import { NotFoundException } from '@exception/custom/not-found.exception';
import { UserExceptionEnum } from '@exception/enum/user.enum';
import { PrismaService } from '@persistence/prisma/prisma.service';

@Injectable()
@Processor(EVENT_TICKET_NFT_QUEUE)
export class MintEventTicketNftProcessor extends WorkerHost {
  private readonly logger = new Logger(MintEventTicketNftProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly xrplNftService: XrplNftService,
    private readonly eventTicketNftRepository: EventTicketNftRepository,
    private readonly userWalletRepository: UserWalletRepository,
  ) {
    super();
  }

  async process(
    job: Job<{
      ownerId: string;
      ticketId: string;
      uri: string;
      count: number;
    }>,
  ) {
    if (job.name !== EVENT_TICKET_NFT_JOB) return;

    const { ownerId, ticketId, uri, count } = job.data;

    const { seed } = await this.userWalletRepository.findByUserId(ownerId);
    if (!seed) {
      throw new NotFoundException(UserExceptionEnum.UserWalletNotFound);
    }

    // Mints NFTs equal to the number of event tickets.
    const nftIds = await this.xrplNftService.batchMintNFT(seed, uri, count);

    // for each nftId, save the nft to the database
    await this.prisma.$transaction(async (tx) => {
      await Promise.all(
        nftIds.map(async (nftId) => {
          const existingNft =
            await this.eventTicketNftRepository.findByNftId(nftId);
          if (existingNft) {
            return;
          }

          await this.eventTicketNftRepository.save(
            ownerId,
            ticketId,
            nftId,
            uri,
            tx,
          );
        }),
      );
    });
  }
}
