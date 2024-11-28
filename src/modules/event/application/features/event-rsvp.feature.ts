import { Injectable } from '@nestjs/common';
import { UserWalletService } from '@user/application/services/user-wallet.service';
import { EventService } from '@event/application/services/event.service';
import { NotFoundException } from '@exception/custom/not-found.exception';
import { EventExceptionEnum } from '@exception/enum/event.enum';
import { EventTicketService } from '@event/application/services/event-ticket.service';
import { EventTicketNftService } from '@event/application/services/event-ticket-nft.service';
import { PrismaService } from '@persistence/prisma/prisma.service';
import { GetEventTicketDto } from '@event/application/dtos/get-event-ticket.dto';
import { EventParticipantService } from '@event/application/services/event-participant.service';
import {
  EventParticipantAccessLevel,
  EventParticipantRole,
} from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { CreateEventParticipantDto } from '@event/application/dtos/create-event-participant.dto';
import {
  EVENT_TICKET_NFT_SELL_OFFER_JOB,
  InjectSellEventTicketQueue,
} from '@shared/decorators/inject/queue.inject.decorator';
import { Queue } from 'bullmq';
import { UserExceptionEnum } from '@exception/enum/user.enum';
import { EventHostService } from '@event/application/services/event-host.service';
import { EventParticipantTicketService } from '@event/application/services/event-participant-ticket.service';
import { ConflictException } from '@exception/custom/conflict.exception';
import { BadRequestException } from '@exception/custom/bad-request.exception';

@Injectable()
export class EventRsvpFeature {
  constructor(
    @InjectSellEventTicketQueue() private readonly nftQueue: Queue,
    private readonly userWalletService: UserWalletService,
    private readonly eventService: EventService,
    private readonly eventTicketService: EventTicketService,
    private readonly eventTicketNftService: EventTicketNftService,
    private readonly eventParticipantService: EventParticipantService,
    private readonly eventHostService: EventHostService,
    private readonly eventParticipantTicketService: EventParticipantTicketService,
    private readonly prisma: PrismaService,
  ) {}

  async rsvp(eventId: string, ticketId: string, userId: string, email: string) {
    const foundEvent = await this.eventService.getEventById(eventId);
    if (!foundEvent) {
      throw new NotFoundException(EventExceptionEnum.EventNotFound);
    }

    const foundEventHosts = await this.eventHostService.getEventHosts(eventId);
    if (foundEventHosts.some((host) => host.user.id === userId)) {
      throw new BadRequestException(EventExceptionEnum.HostCannotRegister);
    }

    const foundParticipant =
      await this.eventParticipantService.getEventParticipant(eventId, userId);
    if (foundParticipant) {
      throw new ConflictException(EventExceptionEnum.AlreadyRegistered);
    }

    const foundEventTickets =
      await this.eventTicketService.getEventTicketsByEventId(eventId);
    const foundTicket = foundEventTickets.find(
      (ticket) => ticket.id === ticketId,
    );
    if (!foundTicket) {
      throw new NotFoundException(EventExceptionEnum.EventTicketNotFound);
    }
    await this.prisma.$transaction(async (tx) => {
      // Buy ticket and send nft to guest. (NFT transfer is executed in the background.)
      await this.buyTicket(userId, foundTicket);

      const createEventParticipantDto = plainToInstance(
        CreateEventParticipantDto,
        {
          email,
          labelId: null,
          role: EventParticipantRole.GUEST,
          accessLevel: EventParticipantAccessLevel.ACCESS_LOUNGE,
        },
      );
      const createdEventParticipant =
        await this.eventParticipantService.createEventParticipant(
          eventId,
          userId,
          createEventParticipantDto,
          tx,
        );
      await this.eventParticipantTicketService.createEventParticipantTicket(
        ticketId,
        createdEventParticipant.id,
        tx,
      );
    });
  }

  /**
   * Buy ticket and send nft to guest.
   * @param userId
   * @param ticket
   * @private
   */
  // TODO: Mutex processing is required to prevent simultaneous purchases.
  private async buyTicket(userId: string, ticket: GetEventTicketDto) {
    const { nftId, owner } =
      await this.eventTicketNftService.getUnusedEventTicketNft(ticket.id);

    if (!nftId) {
      throw new NotFoundException(EventExceptionEnum.EventTicketNftNotFound);
    }

    const foundGuestWallet = await this.userWalletService.getWallet(userId);
    const foundHostWallet = await this.userWalletService.getWallet(owner.id);

    if (!foundGuestWallet || !foundHostWallet) {
      throw new NotFoundException(UserExceptionEnum.UserWalletNotFound);
    }

    // The NFT transfer is executed in the background.
    await this.nftQueue.add(EVENT_TICKET_NFT_SELL_OFFER_JOB, {
      userId,
      hostSeed: foundHostWallet.seed,
      guestSeed: foundGuestWallet.seed,
      guestAddress: foundGuestWallet.address,
      nftId,
      amount: ticket.price,
    });
  }
}
