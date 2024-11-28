import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateEventInfoRequestBodyDto } from '@event/interface/dtos/request/update-event-info.body.dto';
import { EventParamDto } from '@event/interface/dtos/request/event.param.dto';
import { EventManager } from '@event/application/security/roles/event-manager.role.decorator';
import { GetEventInfoResponseDto } from '@event/interface/dtos/response/get-event-info.response.dto';
import { EventManagementFeature } from '@event/application/features/event-management.feature';
import { ExposedGroup } from '@shared/security/groups/exposed-group.decorator';
import { EXPOSED_GROUPS } from '@shared/security/groups/exposed-group.enum';

@ApiTags('Event Management')
@EventManager()
@Controller('event-managements/:eventId')
export class EventManagementController {
  constructor(
    private readonly eventManagementFeature: EventManagementFeature,
  ) {}

  @Patch()
  @HttpCode(HttpStatus.OK)
  async updateEventInfo(
    @Param() { eventId }: EventParamDto,
    @Body() updateEventInfoRequestBodyDto: UpdateEventInfoRequestBodyDto,
  ) {
    await this.eventManagementFeature.updateEventInfo(
      eventId,
      updateEventInfoRequestBodyDto,
    );
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteEvent(@Param() { eventId }: EventParamDto) {
    await this.eventManagementFeature.deleteEvent(eventId);
  }

  @Get()
  @ExposedGroup([EXPOSED_GROUPS.EVENT_MANAGER])
  @HttpCode(HttpStatus.OK)
  async getEventFullInfo(
    @Param() { eventId }: EventParamDto,
  ): Promise<GetEventInfoResponseDto> {
    return this.eventManagementFeature.getEventFullInfo(eventId);
  }
}
