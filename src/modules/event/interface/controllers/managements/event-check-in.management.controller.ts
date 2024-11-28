import { Controller, Delete, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { EventManager } from '@event/application/security/roles/event-manager.role.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Event Management')
@Controller('event-managements/:eventId/check-ins')
@EventManager()
export class EventCheckInManagementController {
  constructor() {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getCheckInsList(): Promise<void> {}

  @Delete(':ticketId')
  @HttpCode(HttpStatus.OK)
  async cancelCheckIn(): Promise<void> {}
}
