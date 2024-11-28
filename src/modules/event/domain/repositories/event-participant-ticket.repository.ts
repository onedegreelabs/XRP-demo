import { Injectable } from '@nestjs/common';
import { PrismaService } from '@persistence/prisma/prisma.service';
import { EventTicketStatus, Prisma } from '@prisma/client';

@Injectable()
export class EventParticipantTicketRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(
    eventTicketId: string,
    participantId: string,
    tx?: Prisma.TransactionClient,
  ) {
    await (tx || this.prisma).eventParticipantTicket.create({
      data: {
        ticket: { connect: { id: eventTicketId } },
        participant: { connect: { id: participantId } },
        status: EventTicketStatus.ACTIVE,
      },
    });
  }
}
