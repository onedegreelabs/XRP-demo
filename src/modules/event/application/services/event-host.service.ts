import { Injectable } from '@nestjs/common';
import { EventHostRepository } from '@event/domain/repositories/event-host.repository';
import { EventHostAccessLevel, Prisma } from '@prisma/client';
import { CreateEventHostDto } from '@event/application/dtos/create-event-host.dto';
import { plainToInstance } from 'class-transformer';
import { GetEventHostDto } from '@event/application/dtos/get-event-host.dto';

@Injectable()
export class EventHostService {
  constructor(private readonly eventHostRepository: EventHostRepository) {}

  async createEventOwner(
    userId: string,
    eventId: string,
    email: string,
    tx?: Prisma.TransactionClient,
  ) {
    const createEventHostDto = plainToInstance(CreateEventHostDto, {
      email,
      listingEnabled: true,
      accessLevel: EventHostAccessLevel.OWNER,
    });
    await this.eventHostRepository.save(
      userId,
      eventId,
      createEventHostDto,
      tx,
    );
  }

  async getEventHosts(eventId: string): Promise<GetEventHostDto[]> {
    const foundEventHosts =
      await this.eventHostRepository.findByEventId(eventId);
    return plainToInstance(GetEventHostDto, foundEventHosts);
  }
}
