import { Injectable } from '@nestjs/common';
import { PrismaService } from '@persistence/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UpsertEventLocationDto } from '@event/application/dtos/upsert-event-location.dto';

@Injectable()
export class EventLocationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(
    eventId: string,
    data: UpsertEventLocationDto,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx || this.prisma).eventLocation.upsert({
      where: {
        eventId,
      },
      update: data,
      create: {
        ...data,
        event: { connect: { id: eventId } },
      },
    });
  }
}
