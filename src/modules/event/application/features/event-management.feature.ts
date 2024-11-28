import { Injectable } from '@nestjs/common';
import { EventService } from '@event/application/services/event.service';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '@persistence/prisma/prisma.service';
import { EventLocationService } from '@event/application/services/event-location.service';
import { EventTicketService } from '@event/application/services/event-ticket.service';
import { EventHostService } from '@event/application/services/event-host.service';
import { UpdateEventInfoRequestBodyDto } from '@event/interface/dtos/request/update-event-info.body.dto';
import { UpdateEventDto } from '@event/application/dtos/update-event.dto';
import { NotFoundException } from '@exception/custom/not-found.exception';
import { EventExceptionEnum } from '@exception/enum/event.enum';
import { GetEventInfoResponseDto } from '@event/interface/dtos/response/get-event-info.response.dto';
import { EXPOSED_GROUPS } from '@shared/security/groups/exposed-group.enum';

@Injectable()
export class EventManagementFeature {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventService: EventService,
    private readonly eventLocationService: EventLocationService,
    private readonly eventTicketService: EventTicketService,
    private readonly eventHostService: EventHostService,
  ) {}

  async updateEventInfo(
    eventId: string,
    updateEventInfoRequestBodyDto: UpdateEventInfoRequestBodyDto,
  ): Promise<void> {
    const foundEvent = await this.eventService.getEventById(eventId);
    if (!foundEvent) {
      throw new NotFoundException(EventExceptionEnum.EventNotFound);
    }
    await this.prisma.$transaction(async (tx) => {
      // 이벤트 데이터 수정
      const updateEventDto = plainToInstance(
        UpdateEventDto,
        updateEventInfoRequestBodyDto,
      );
      const updatedEvent = await this.eventService.updateEvent(
        foundEvent.id,
        updateEventDto,
        tx,
      );

      // 이벤트 위치 정보 수정
      if (updateEventInfoRequestBodyDto.location) {
        await this.eventLocationService.upsertEventLocation(
          updatedEvent.id,
          updateEventInfoRequestBodyDto.location,
          tx,
        );
      }
    });
  }

  async deleteEvent(eventId: string): Promise<void> {
    const foundEvent = await this.eventService.getEventById(eventId);
    if (!foundEvent) {
      throw new NotFoundException(EventExceptionEnum.EventNotFound);
    }
    await this.eventService.deleteEvent(eventId);
  }

  async getEventFullInfo(eventId: string): Promise<GetEventInfoResponseDto> {
    const { setting: foundEventSetting, ...foundEventInfo } =
      await this.eventService.getEventById(eventId);

    if (!foundEventInfo) {
      throw new NotFoundException(EventExceptionEnum.EventNotFound);
    }

    const foundEventHosts = await this.eventHostService.getEventHosts(eventId);
    const foundEventTickets =
      await this.eventTicketService.getEventTicketsByEventId(eventId);

    return plainToInstance(
      GetEventInfoResponseDto,
      {
        ...foundEventInfo,
        ...foundEventSetting,
        hosts: foundEventHosts,
        tickets: foundEventTickets,
      },
      { groups: [EXPOSED_GROUPS.EVENT_MANAGER] },
    );
  }
}
