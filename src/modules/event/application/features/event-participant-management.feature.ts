import { Injectable } from '@nestjs/common';
import { GetEventParticipantResponseDto } from '@event/interface/dtos/response/get-event-participant.response.dto';
import { OffsetPaginated } from '@shared/types/pagination.type';
import { EventParticipantService } from '@event/application/services/event-participant.service';
import { GetEventParticipantListQueryDto } from '@event/interface/dtos/request/get-event-participant-list.query.dto';
import { plainToInstance } from 'class-transformer';
import { EventHostAccessLevel } from '@prisma/client';

@Injectable()
export class EventParticipantManagementFeature {
  constructor(
    private readonly eventParticipantService: EventParticipantService,
  ) {}

  async getEventParticipantList(
    eventId: string,
    getEventParticipantListQueryDto: GetEventParticipantListQueryDto,
  ): Promise<OffsetPaginated<GetEventParticipantResponseDto>> {
    const { search, ...paginationQueryDto } = getEventParticipantListQueryDto;
    const { items, ...paginationParam } =
      await this.eventParticipantService.getEventParticipantList(
        eventId,
        paginationQueryDto,
        search,
      );

    const formattedItems = plainToInstance(
      GetEventParticipantResponseDto,
      items,
      { groups: [EventHostAccessLevel.MANAGER] },
    );

    return {
      items: formattedItems,
      ...paginationParam,
    };
  }
}
