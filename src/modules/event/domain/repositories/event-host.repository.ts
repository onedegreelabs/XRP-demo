import { Injectable } from '@nestjs/common';
import { PrismaService } from '@persistence/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateEventHostDto } from '@event/application/dtos/create-event-host.dto';

@Injectable()
export class EventHostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(
    userId: string,
    eventId: string,
    data: CreateEventHostDto,
    tx?: Prisma.TransactionClient,
  ) {
    await (tx || this.prisma).eventHost.create({
      data: {
        user: { connect: { id: userId } },
        event: { connect: { id: eventId } },
        ...data,
      },
    });
  }

  async findByEventId(eventId: string) {
    return this.prisma.eventHost.findMany({
      where: { eventId },
      include: { user: true },
    });
  }
}
