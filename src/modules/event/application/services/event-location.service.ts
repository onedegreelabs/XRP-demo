import { Injectable } from '@nestjs/common';
import { EventLocationRepository } from '@event/domain/repositories/event-location.repository';
import { UpsertEventLocationDto } from '@event/application/dtos/upsert-event-location.dto';
import { GetEventLocationDto } from '@event/application/dtos/get-event-location.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class EventLocationService {
  constructor(
    private readonly eventLocationRepository: EventLocationRepository,
  ) {}

  async upsertEventLocation(
    eventId: string,
    upsertEventLocationDto: UpsertEventLocationDto,
    tx?: any,
  ): Promise<GetEventLocationDto> {
    const upsertedEventLocation = this.eventLocationRepository.upsert(
      eventId,
      upsertEventLocationDto,
      tx,
    );
    return plainToInstance(GetEventLocationDto, upsertedEventLocation);
  }
}
