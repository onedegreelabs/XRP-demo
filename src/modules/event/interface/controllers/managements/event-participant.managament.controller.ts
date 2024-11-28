import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { EventParamDto } from '@event/interface/dtos/request/event.param.dto';
import { EventManager } from '@event/application/security/roles/event-manager.role.decorator';
import { EventParticipantManagementFeature } from '@event/application/features/event-participant-management.feature';
import { GetEventParticipantListQueryDto } from '@event/interface/dtos/request/get-event-participant-list.query.dto';
import { ApiTags } from '@nestjs/swagger';
import { ExposedGroup } from '@shared/security/groups/exposed-group.decorator';
import { EXPOSED_GROUPS } from '@shared/security/groups/exposed-group.enum';
import { OffsetPaginated } from '@shared/types/pagination.type';
import { GetEventParticipantResponseDto } from '@event/interface/dtos/response/get-event-participant.response.dto';

@ApiTags('Event Management')
@Controller('event-managements/:eventId')
@EventManager()
export class EventParticipantManagementController {
  constructor(
    private readonly participantManagementFeature: EventParticipantManagementFeature,
  ) {}

  @Get('participants')
  @ExposedGroup([EXPOSED_GROUPS.EVENT_MANAGER])
  @HttpCode(HttpStatus.OK)
  async getEventParticipantList(
    @Param() { eventId }: EventParamDto,
    @Query() getEventParticipantListQueryDto: GetEventParticipantListQueryDto,
  ): Promise<OffsetPaginated<GetEventParticipantResponseDto>> {
    return this.participantManagementFeature.getEventParticipantList(
      eventId,
      getEventParticipantListQueryDto,
    );
  }
}
