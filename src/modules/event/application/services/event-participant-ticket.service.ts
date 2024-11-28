import { Injectable } from '@nestjs/common';
import { EventParticipantTicketRepository } from '@event/domain/repositories/event-participant-ticket.repository';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { GetEventParticipantTicketDto } from '@event/application/dtos/get-event-participant-ticket.dto';

@Injectable()
export class EventParticipantTicketService {
  constructor(
    private readonly eventParticipantRepository: EventParticipantTicketRepository,
  ) {}

  async createEventParticipantTicket(
    eventTicketId: string,
    participantId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const createdEventParticipantTicket =
      await this.eventParticipantRepository.save(
        eventTicketId,
        participantId,
        tx,
      );
    return plainToInstance(
      GetEventParticipantTicketDto,
      createdEventParticipantTicket,
    );
  }
}
