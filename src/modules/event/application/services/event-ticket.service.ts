import { Injectable } from '@nestjs/common';
import { EventTicketRepository } from '@event/domain/repositories/event-ticket.repository';
import { CreateEventTicketDto } from '@event/application/dtos/create-event-ticket.dto';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { GetEventTicketDto } from '@event/application/dtos/get-event-ticket.dto';

@Injectable()
export class EventTicketService {
  constructor(private readonly eventTicketRepository: EventTicketRepository) {}

  async createEventTickets(
    eventId: string,
    createEventTicketDtoArr: CreateEventTicketDto[],
    tx?: Prisma.TransactionClient,
  ): Promise<GetEventTicketDto[]> {
    const createdEventTickets = await Promise.all(
      createEventTicketDtoArr.map((createEventTicketDto) =>
        this.eventTicketRepository.save(eventId, createEventTicketDto, tx),
      ),
    );
    return plainToInstance(GetEventTicketDto, createdEventTickets);
  }

  async getEventTicketsByEventId(
    eventId: string,
  ): Promise<GetEventTicketDto[]> {
    const foundEventTickets =
      await this.eventTicketRepository.findByEventId(eventId);
    return plainToInstance(GetEventTicketDto, foundEventTickets);
  }
}
