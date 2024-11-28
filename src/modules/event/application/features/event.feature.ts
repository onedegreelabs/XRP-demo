import { Injectable } from '@nestjs/common';
import { CreateEventRequestBodyDto } from '@event/interface/dtos/request/create-event.body.dto';
import { CreateEventResponseDto } from '@event/interface/dtos/response/create-event.response.dto';
import { GetEventDto } from '@event/application/dtos/get-event.dto';
import { plainToInstance } from 'class-transformer';
import { CreateEventDto } from '@event/application/dtos/create-event.dto';
import { CreateEventTicketDto } from '@event/application/dtos/create-event-ticket.dto';
import { CreateEventSettingDto } from '@event/application/dtos/create-event-setting.dto';
import { PrismaService } from '@persistence/prisma/prisma.service';
import { EventService } from '@event/application/services/event.service';
import { EventLocationService } from '@event/application/services/event-location.service';
import { EventSettingService } from '@event/application/services/event-setting.service';
import { EventTicketService } from '@event/application/services/event-ticket.service';
import { EventHostService } from '@event/application/services/event-host.service';
import { GetEventInfoResponseDto } from '@event/interface/dtos/response/get-event-info.response.dto';
import { NotFoundException } from '@exception/custom/not-found.exception';
import { EventExceptionEnum } from '@exception/enum/event.enum';
import { EventTicketNftService } from '@event/application/services/event-ticket-nft.service';
import { GetEventListQueryDto } from '@event/interface/dtos/request/get-event-list.query.dto';
import { CursorPaginated } from '@shared/types/pagination.type';
import { EXPOSED_GROUPS } from '@shared/security/groups/exposed-group.enum';

@Injectable()
export class EventFeature {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventService: EventService,
    private readonly eventLocationService: EventLocationService,
    private readonly eventSettingService: EventSettingService,
    private readonly eventTicketService: EventTicketService,
    private readonly eventHostService: EventHostService,
    private readonly eventTicketNftService: EventTicketNftService,
  ) {}

  async createEvent(
    userId: string,
    email: string,
    createEventRequestBodyDto: CreateEventRequestBodyDto,
  ): Promise<CreateEventResponseDto> {
    let createdEvent = {} as GetEventDto;

    await this.prisma.$transaction(async (tx) => {
      // 이벤트 데이터 생성
      const createEventDto = plainToInstance(CreateEventDto, {
        handle: await this.eventService.getRandomHandle(),
        ...createEventRequestBodyDto,
      });

      createdEvent = await this.eventService.createEvent(createEventDto, tx);

      // 이벤트 위치 정보 생성
      if (createEventRequestBodyDto.location) {
        await this.eventLocationService.upsertEventLocation(
          createdEvent.id,
          createEventRequestBodyDto.location,
          tx,
        );
      }

      // 이벤트 티켓 생성
      // !!! MVP2 에서는 기본 티켓 1개만 생성하도록 함.
      const createEventTicketDtoArr = plainToInstance(CreateEventTicketDto, [
        {
          price: createEventRequestBodyDto.price,
          capacity: createEventRequestBodyDto.registrationCapacity, // 기본 티켓의 capacity 는 registrationCapacity 로 설정
          salesStartAt: new Date(), // 기본 티켓의 판매 시작일시는 현재 시간으로 설정
          salesEndAt: createEventRequestBodyDto.startAt, // 기본 티켓의 판매 종료일시는 이벤트 시작 시간으로 설정
          approvalRequired: false,
        },
      ]);
      const createdEventTickets =
        await this.eventTicketService.createEventTickets(
          createdEvent.id,
          createEventTicketDtoArr,
          tx,
        );

      // 생성한 티켓 그룹만큼 NFT 생성
      await Promise.all(
        createdEventTickets.map(async (ticket) => {
          await this.eventTicketNftService.createEventTicketNfts(
            userId,
            ticket,
            createEventRequestBodyDto.registrationCapacity,
            tx,
          );
        }),
      );

      // 이벤트 설정 정보 추가
      const createEventSettingDto = plainToInstance(CreateEventSettingDto, {
        registrationCapacity: createEventRequestBodyDto.registrationCapacity,
        registrationEnabled: true,
        waitlistEnabled: false,
        waitlitistCapacity: 0,
      });
      await this.eventSettingService.createEventSetting(
        createdEvent.id,
        createEventSettingDto,
        tx,
      );

      // 이벤트 호스트 (Owner) 생성
      await this.eventHostService.createEventOwner(
        userId,
        createdEvent.id,
        email,
        tx,
      );
    });

    return plainToInstance(CreateEventResponseDto, {
      eventId: createdEvent.id,
    });
  }

  async getEventInfo(handle: string): Promise<GetEventInfoResponseDto> {
    const { setting: foundEventSetting, ...foundEventInfo } =
      await this.eventService.getEventByHandle(handle);

    if (!foundEventInfo) {
      throw new NotFoundException(EventExceptionEnum.EventNotFound);
    }

    const foundEventHosts = await this.eventHostService.getEventHosts(
      foundEventInfo.id,
    );
    const foundEventTickets =
      await this.eventTicketService.getEventTicketsByEventId(foundEventInfo.id);
    return plainToInstance(GetEventInfoResponseDto, {
      ...foundEventInfo,
      ...foundEventSetting,
      hosts: foundEventHosts,
      tickets: foundEventTickets,
    });
  }

  async getEventList(
    getEventListQueryDto: GetEventListQueryDto,
  ): Promise<CursorPaginated<GetEventInfoResponseDto>> {
    const { search, ...paginationQueryDto } = getEventListQueryDto;
    const { items, ...paginationParam } = await this.eventService.getEventList(
      paginationQueryDto,
      search,
    );

    const formattedItems = plainToInstance(GetEventInfoResponseDto, items);

    return {
      items: formattedItems,
      ...paginationParam,
    };
  }

  async getMyEvents(userId: string): Promise<GetEventInfoResponseDto[]> {
    const foundEvents = await this.eventService.getMyEvents(userId);
    return plainToInstance(GetEventInfoResponseDto, foundEvents, {
      groups: [EXPOSED_GROUPS.ME],
    });
  }
}
