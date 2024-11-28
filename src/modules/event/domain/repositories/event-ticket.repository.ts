import { Injectable } from '@nestjs/common';
import { PrismaService } from '@persistence/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateEventTicketDto } from '@event/application/dtos/create-event-ticket.dto';

@Injectable()
export class EventTicketRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(
    eventId: string,
    data: CreateEventTicketDto,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx || this.prisma).eventTicket.create({
      data: {
        ...data,
        event: { connect: { id: eventId } },
      },
      include: { event: { include: { location: true } } },
    });
  }

  async findById(id: string) {
    return this.prisma.eventTicket.findUnique({
      where: { id },
      include: { event: { include: { location: true } } },
    });
  }

  async findByEventId(eventId: string) {
    return this.prisma.eventTicket.findMany({
      where: { eventId },
    });
  }
}
