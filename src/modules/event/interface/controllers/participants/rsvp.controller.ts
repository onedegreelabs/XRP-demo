import { Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { EventRsvpFeature } from '@event/application/features/event-rsvp.feature';
import { FreeMembership } from '@shared/security/roles/free-membership.role.decorator';
import { User } from '@shared/decorators/user.request.decorator';
import { AuthTokenPayloadDto } from '@user/interface/dtos/common/auth-token-payload.dto';

@Controller('events/:eventId')
@FreeMembership()
export class RsvpController {
  constructor(private readonly eventRsvpFeature: EventRsvpFeature) {}

  /**
   * Register for an event
   * @param payload
   * @param eventId
   * @param ticketId
   */
  @Post('tickets/:ticketId/rsvp')
  @HttpCode(HttpStatus.OK)
  async rsvp(
    @User() payload: AuthTokenPayloadDto,
    @Param('eventId') eventId: string,
    @Param('ticketId') ticketId: string,
  ) {
    await this.eventRsvpFeature.rsvp(
      eventId,
      ticketId,
      payload.userId,
      payload.email,
    );
  }
}
