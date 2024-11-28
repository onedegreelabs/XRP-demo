import { Injectable } from '@nestjs/common';
import { EventParticipantRepository } from '@event/domain/repositories/event-participant.repository';
import { OffsetPaginationQueryDto } from '@shared/dtos/request/offset-pagination.query.dto';
import { GetEventParticipantDto } from '@event/application/dtos/get-event-participant.dto';
import { plainToInstance } from 'class-transformer';
import { buildPrismaPaginationParam } from '@util/pagination.util';
import { Prisma } from '@prisma/client';
import { NotFoundException } from '@exception/custom/not-found.exception';
import { EventExceptionEnum } from '@exception/enum/event.enum';
import { EventRepository } from '@event/domain/repositories/event.repository';
import { OffsetPaginated } from '@shared/types/pagination.type';
import { CreateEventParticipantDto } from '@event/application/dtos/create-event-participant.dto';

@Injectable()
export class EventParticipantService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventParticipantRepository: EventParticipantRepository,
  ) {}

  async getEventParticipantList(
    eventId: string,
    paginationQueryDto: OffsetPaginationQueryDto,
    search?: string,
  ): Promise<OffsetPaginated<GetEventParticipantDto>> {
    const foundEvent = await this.eventRepository.findById(eventId);

    if (!foundEvent) {
      throw new NotFoundException(EventExceptionEnum.EventNotFound);
    }

    const prismaPaginationParam =
      buildPrismaPaginationParam(paginationQueryDto);

    const prismaSearchInput = this.buildPrismaSearchInput(search);

    const foundEventParticipants =
      await this.eventParticipantRepository.findByEventId(
        foundEvent.id,
        prismaPaginationParam,
        prismaSearchInput,
      );

    const items = plainToInstance(
      GetEventParticipantDto,
      foundEventParticipants,
    );
    const totalItems = await this.getEventParticipantCount(eventId, search);
    const hasMore =
      totalItems > prismaPaginationParam.skip + prismaPaginationParam.take;
    const totalPages = Math.ceil(totalItems / prismaPaginationParam.take);
    const page = paginationQueryDto.page;
    const take = prismaPaginationParam.take;

    return {
      items,
      totalItems,
      totalPages,
      page,
      take,
      hasMore,
    };
  }

  async getEventParticipantCount(
    eventId: string,
    search?: string,
  ): Promise<number> {
    const prismaSearchInput = this.buildPrismaSearchInput(search);
    return this.eventParticipantRepository.countByEventId(
      eventId,
      prismaSearchInput,
    );
  }

  private buildPrismaSearchInput(
    search: string,
  ): Prisma.EventParticipantWhereInput {
    return {
      OR: search
        ? [
            {
              user: {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },
            {
              email: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ]
        : undefined,
    };
  }

  async getEventParticipant(eventId: string, userId: string) {
    const foundEventParticipant =
      await this.eventParticipantRepository.findByEventIdAndUserId(
        eventId,
        userId,
      );
    return plainToInstance(GetEventParticipantDto, foundEventParticipant);
  }

  async createEventParticipant(
    eventId: string,
    userId: string,
    createEventParticipantDto: CreateEventParticipantDto,
    tx?: Prisma.TransactionClient,
  ): Promise<GetEventParticipantDto> {
    return this.eventParticipantRepository.save(
      eventId,
      userId,
      createEventParticipantDto,
      tx,
    );
  }
}
