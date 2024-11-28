import { Injectable } from '@nestjs/common';
import { EventRepository } from '@event/domain/repositories/event.repository';
import { CreateEventDto } from '@event/application/dtos/create-event.dto';
import { Prisma } from '@prisma/client';
import { UpdateEventDto } from '@event/application/dtos/update-event.dto';
import { plainToInstance } from 'class-transformer';
import { GetEventDto } from '@event/application/dtos/get-event.dto';
import { generateRandomString } from '@util/index';
import { EVENT_CONSTRAINTS } from '@event/interface/constants/event.constant';
import { CursorPaginated } from '@shared/types/pagination.type';
import { buildPrismaPaginationParam } from '@util/pagination.util';
import { CursorPaginationQueryDto } from '@shared/dtos/request/cursor-pagination.query.dto';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  async createEvent(
    createEventDto: CreateEventDto,
    tx?: Prisma.TransactionClient,
  ): Promise<GetEventDto> {
    const createdEvent = await this.eventRepository.save(createEventDto, tx);
    return plainToInstance(GetEventDto, createdEvent);
  }

  async getEventById(eventId: string): Promise<GetEventDto> {
    const foundEvent = await this.eventRepository.findById(eventId);
    return plainToInstance(GetEventDto, foundEvent);
  }

  async getEventByHandle(handle: string): Promise<GetEventDto> {
    const foundEvent = await this.eventRepository.findByHandle(handle);
    return plainToInstance(GetEventDto, foundEvent);
  }

  async updateEvent(
    eventId: string,
    updateEventDto: UpdateEventDto,
    tx?: Prisma.TransactionClient,
  ): Promise<GetEventDto> {
    const upatedEvent = await this.eventRepository.update(
      eventId,
      updateEventDto,
      tx,
    );
    return plainToInstance(GetEventDto, upatedEvent);
  }

  async deleteEvent(
    eventId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    await this.eventRepository.delete(eventId, tx);
  }

  async getRandomHandle(): Promise<string> {
    let randomStringLength = EVENT_CONSTRAINTS.RANDOM_HANDLE_MIN_LENGTH;
    const retryLimit = 5;

    while (true) {
      for (let i = 0; i < retryLimit; i++) {
        const handle = generateRandomString(
          'abcdefghjklmnpqrstuvwxyz23456789',
          randomStringLength,
        );
        const foundUser = await this.eventRepository.findHandleByHandle(handle);
        if (!foundUser) {
          return handle;
        }
      }
      // retryLimit 횟수 내에 고유 핸들을 찾지 못하면 길이를 1 증가
      randomStringLength++;
    }
  }

  async getEventList(
    paginationQueryDto: CursorPaginationQueryDto,
    search?: string,
  ): Promise<CursorPaginated<GetEventDto>> {
    const prismaPaginationParam =
      buildPrismaPaginationParam(paginationQueryDto);

    const prismaSearchInput = this.buildPrismaSearchInput(search);

    const foundEvents = await this.eventRepository.findMany(
      prismaPaginationParam,
      prismaSearchInput,
    );

    const items = plainToInstance(GetEventDto, foundEvents);
    const totalItems = await this.getEventCount(search);
    const hasMore =
      totalItems > prismaPaginationParam.skip + prismaPaginationParam.take;
    const take = prismaPaginationParam.take;
    const cursorId = foundEvents[foundEvents.length - 1]?.id;

    return {
      items,
      totalItems,
      take,
      cursorId,
      hasMore,
    };
  }

  async getEventCount(search?: string): Promise<number> {
    const prismaSearchInput = this.buildPrismaSearchInput(search);
    return this.eventRepository.count(prismaSearchInput);
  }

  private buildPrismaSearchInput(search: string): Prisma.EventWhereInput {
    return {
      OR: search
        ? [
            {
              title: {
                contains: search,
                mode: 'insensitive',
              },
              location: {
                fullAddress: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },
          ]
        : undefined,
    };
  }

  async getMyEvents(userId: string): Promise<GetEventDto[]> {
    const foundEvents = await this.eventRepository.findByUserId(userId);
    return plainToInstance(GetEventDto, foundEvents);
  }
}
