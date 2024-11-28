import { Injectable } from '@nestjs/common';
import { PrismaService } from '@persistence/prisma/prisma.service';
import { CreateEventDto } from '@event/application/dtos/create-event.dto';
import { Prisma } from '@prisma/client';
import { UpdateEventDto } from '@event/application/dtos/update-event.dto';
import { PrismaPaginationParam } from '@shared/types/pagination.type';

@Injectable()
export class EventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(data: CreateEventDto, tx?: Prisma.TransactionClient) {
    return (tx || this.prisma).event.create({ data });
  }

  async update(
    eventId: string,
    data: UpdateEventDto,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx || this.prisma).event.update({ where: { id: eventId }, data });
  }

  async delete(eventId: string, tx?: Prisma.TransactionClient) {
    return (tx || this.prisma).event.update({
      where: { id: eventId },
      data: { deletedAt: new Date() },
    });
  }

  async findById(eventId: string) {
    return this.prisma.event.findFirst({
      where: { id: eventId, deletedAt: null },
      include: {
        location: true,
        setting: true,
      },
    });
  }

  async findByHandle(handle: string) {
    return this.prisma.event.findFirst({
      where: { handle, deletedAt: null },
      include: {
        location: true,
        setting: true,
      },
    });
  }

  async findHandleByHandle(handle: string) {
    return this.prisma.event.findFirst({
      where: { handle, deletedAt: null },
      select: { handle: true },
    });
  }

  async findMany(
    prismaPaginationParam: PrismaPaginationParam,
    prismaSearchInput?: Prisma.EventParticipantWhereInput,
  ) {
    return this.prisma.event.findMany({
      where: { deletedAt: null, ...prismaSearchInput },
      include: {
        location: true,
        setting: true,
        hosts: { include: { user: true } },
        tickets: true,
      },
      ...prismaPaginationParam,
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.event.findMany({
      where: { deletedAt: null, participants: { some: { userId } } },
      include: {
        location: true,
        setting: true,
        hosts: { include: { user: true } },
        tickets: true,
        participants: {
          where: {
            userId,
          },
          include: {
            user: { include: { eventTicketNfts: true } },
            ticket: true,
          },
        },
      },
    });
  }

  async count(prismaSearchInput?: Prisma.EventWhereInput) {
    return this.prisma.event.count({
      where: { deletedAt: null, ...prismaSearchInput },
    });
  }
}
