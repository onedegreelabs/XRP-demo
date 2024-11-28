import { Injectable } from '@nestjs/common';
import { PrismaService } from '@persistence/prisma/prisma.service';
import { PrismaPaginationParam } from '@shared/types/pagination.type';
import { Prisma } from '@prisma/client';
import { CreateEventParticipantDto } from '@event/application/dtos/create-event-participant.dto';

@Injectable()
export class EventParticipantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(
    eventId: string,
    userId: string,
    data: CreateEventParticipantDto,
    tx?: Prisma.TransactionClient,
  ) {
    const { labelId, ...restData } = data;
    return (tx || this.prisma).eventParticipant.create({
      data: {
        event: { connect: { id: eventId } },
        user: { connect: { id: userId } },
        ...(labelId && { label: { connect: { id: labelId } } }),
        ...restData,
        registeredAt: new Date(),
      },
    });
  }

  async findByEventId(
    eventId: string,
    prismaPaginationParam: PrismaPaginationParam,
    prismaSearchInput?: Prisma.EventParticipantWhereInput,
  ) {
    return this.prisma.eventParticipant.findMany({
      where: {
        eventId,
        ...prismaSearchInput,
      },
      include: {
        user: true,
        networkingParticipant: {
          include: {
            socials: true,
            tags: { include: { tag: true } },
          },
        },
      },
      orderBy: [{ user: { name: 'asc' } }, { email: 'asc' }],
      ...prismaPaginationParam,
    });
  }

  async findByEventIdAndUserId(eventId: string, userId: string) {
    return this.prisma.eventParticipant.findFirst({
      where: {
        eventId,
        userId,
      },
    });
  }

  async countByEventId(
    eventId: string,
    prismaSearchInput?: Prisma.EventParticipantWhereInput,
  ) {
    return this.prisma.eventParticipant.count({
      where: {
        eventId,
        ...prismaSearchInput,
      },
    });
  }
}
