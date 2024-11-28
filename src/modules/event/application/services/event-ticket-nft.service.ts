import { Injectable } from '@nestjs/common';
import { GetEventTicketDto } from '@event/application/dtos/get-event-ticket.dto';
import { Queue } from 'bullmq';
import {
  EVENT_TICKET_NFT_JOB,
  InjectCreateEventTicketQueue,
} from '@shared/decorators/inject/queue.inject.decorator';
import { ENVIRONMENT_KEY } from '@env/variables';
import { S3ObjectDto } from '@persistence/s3/s3-object.dto';
import { EVENT_CONSTRAINTS } from '@event/interface/constants/event.constant';
import { EnvService } from '@env/services/env.service';
import { AwsS3Service } from '@persistence/s3/aws-s3.service';
import { Prisma } from '@prisma/client';
import { EventTicketNftRepository } from '@event/domain/repositories/event-ticket-nft.repository';
import { GetEventTicketNftDto } from '@event/application/dtos/get-event-ticket-nft.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class EventTicketNftService {
  constructor(
    @InjectCreateEventTicketQueue() private readonly nftQueue: Queue,
    private readonly envService: EnvService,
    private readonly awsS3Service: AwsS3Service,
    private readonly eventTicketNftRepository: EventTicketNftRepository,
  ) {}

  /**
   * @description Create Event Ticket NFTs
   * @param userId
   * @param ticket
   * @param count
   * @param tx
   */
  async createEventTicketNfts(
    userId: string,
    ticket: GetEventTicketDto,
    count: number,
    tx?: Prisma.TransactionClient,
  ) {
    // Upload ticket metadata to S3.
    const { key } = await this.uploadTicketMetadataToS3(ticket);
    const uri = `${this.envService.get(ENVIRONMENT_KEY.CDN_URL)}/${key}`;

    // Since minting NFTs for the number of tickets takes a long time,
    // a job is added to the queue for background processing.
    await this.nftQueue.add(
      EVENT_TICKET_NFT_JOB,
      {
        ownerId: userId,
        ticketId: ticket.id,
        uri,
        count,
      },
      { delay: 2000 },
    );
  }

  /**
   * @description Upload Ticket Metadata to S3
   * @param ticket
   * @private
   */
  private async uploadTicketMetadataToS3(
    ticket: GetEventTicketDto,
  ): Promise<S3ObjectDto> {
    const metadata = JSON.stringify({
      ticketId: ticket.id,
      issueDate: new Date(),
      event: {
        id: ticket.event.id,
        title: ticket.event.title,
        startAt: ticket.event.startAt,
        endAt: ticket.event.endAt,
        location: ticket.event.location.fullAddress,
      },
    });

    const saveDir = EVENT_CONSTRAINTS.TICKET_METADATA_SAVE_DIR;
    return this.awsS3Service.uploadJson(metadata, saveDir);
  }

  /**
   * @description Get Unused Event Ticket NFT
   * @param ticketId
   */
  async getUnusedEventTicketNft(
    ticketId: string,
  ): Promise<GetEventTicketNftDto> {
    const foundEventTicketNft =
      await this.eventTicketNftRepository.findUnusedByTicketId(ticketId);
    return plainToInstance(GetEventTicketNftDto, foundEventTicketNft);
  }

  /**
   * @description Transfer Event Ticket NFT
   * @param nftId
   * @param newOwnerId
   * @param tx
   */
  async transferEventTicketNft(
    nftId: string,
    newOwnerId: string,
    tx?: Prisma.TransactionClient,
  ) {
    await this.eventTicketNftRepository.updateOwner(nftId, newOwnerId, tx);
  }
}
