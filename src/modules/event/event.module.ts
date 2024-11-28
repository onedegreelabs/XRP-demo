import { Module } from '@nestjs/common';
import { EventService } from '@event/application/services/event.service';
import { EventRepository } from '@event/domain/repositories/event.repository';
import { EventSettingService } from '@event/application/services/event-setting.service';
import { EventSettingRepository } from '@event/domain/repositories/event-setting.repository';
import { EventManagementFeature } from '@event/application/features/event-management.feature';
import { EventHostService } from '@event/application/services/event-host.service';
import { EventHostRepository } from '@event/domain/repositories/event-host.repository';
import { EventLocationService } from '@event/application/services/event-location.service';
import { EventLocationRepository } from '@event/domain/repositories/event-location.repository';
import { EventTicketService } from '@event/application/services/event-ticket.service';
import { EventTicketRepository } from '@event/domain/repositories/event-ticket.repository';
import { EventManagerGuard } from '@event/application/security/guards/event-manager.guard';
import { EventParticipantManagementFeature } from '@event/application/features/event-participant-management.feature';
import { EventParticipantService } from '@event/application/services/event-participant.service';
import { EventParticipantRepository } from '@event/domain/repositories/event-participant.repository';
import { EventManagementController } from '@event/interface/controllers/managements/event.management.controller';
import { EventParticipantManagementController } from '@event/interface/controllers/managements/event-participant.managament.controller';
import { EventController } from '@event/interface/controllers/participants/event.controller';
import { EventFeature } from '@event/application/features/event.feature';
import { EventTicketNftService } from '@event/application/services/event-ticket-nft.service';
import { EventTicketNftRepository } from '@event/domain/repositories/event-ticket-nft.repository';
import { UserModule } from '@user/user.module';
import { XrplModule } from '@config/crypto/xrpl/xrpl.module';
import { QueueBoardModule } from '@config/queue/queue-board/queue-board.module';
import {
  EVENT_TICKET_NFT_QUEUE,
  EVENT_TICKET_NFT_SELL_OFFER_QUEUE,
} from '@shared/decorators/inject/queue.inject.decorator';
import { MintEventTicketNftProcessor } from '@event/infrastructure/processors/mint-event-ticket-nft.processor';
import { EventRsvpFeature } from '@event/application/features/event-rsvp.feature';
import { RsvpController } from '@event/interface/controllers/participants/rsvp.controller';
import { NftSellOfferProcessor } from '@event/infrastructure/processors/nft-sell-offer.processor';
import { EventParticipantTicketRepository } from '@event/domain/repositories/event-participant-ticket.repository';
import { EventParticipantTicketService } from '@event/application/services/event-participant-ticket.service';

@Module({
  imports: [
    UserModule,
    XrplModule,
    QueueBoardModule.register({
      queues: [EVENT_TICKET_NFT_QUEUE, EVENT_TICKET_NFT_SELL_OFFER_QUEUE],
    }),
  ],
  controllers: [
    EventController,
    EventManagementController,
    EventParticipantManagementController,
    EventController,
    RsvpController,
  ],
  providers: [
    MintEventTicketNftProcessor,
    NftSellOfferProcessor,
    EventManagerGuard,
    EventFeature,
    EventService,
    EventRepository,
    EventSettingService,
    EventSettingRepository,
    EventManagementFeature,
    EventHostService,
    EventHostRepository,
    EventLocationService,
    EventLocationRepository,
    EventTicketService,
    EventTicketRepository,
    EventTicketNftService,
    EventTicketNftRepository,
    EventParticipantManagementFeature,
    EventParticipantService,
    EventParticipantRepository,
    EventRsvpFeature,
    EventParticipantTicketService,
    EventParticipantTicketRepository,
  ],
  exports: [],
})
export class EventModule {}
