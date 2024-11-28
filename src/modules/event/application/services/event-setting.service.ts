import { Injectable } from '@nestjs/common';
import { EventSettingRepository } from '@event/domain/repositories/event-setting.repository';
import { CreateEventSettingDto } from '@event/application/dtos/create-event-setting.dto';
import { GetEventSettingDto } from '@event/application/dtos/get-event-setting.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class EventSettingService {
  constructor(
    private readonly eventSettingRepository: EventSettingRepository,
  ) {}

  async createEventSetting(
    eventId: string,
    createEventSettingDto: CreateEventSettingDto,
    tx?: any,
  ): Promise<GetEventSettingDto> {
    const createdEventSetting = this.eventSettingRepository.save(
      eventId,
      createEventSettingDto,
      tx,
    );
    return plainToInstance(GetEventSettingDto, createdEventSetting);
  }

  async updateEventRegistrationEnabled(
    eventId: string,
    registrationEnabled: boolean,
    tx?: any,
  ): Promise<GetEventSettingDto> {
    const updatedEventSetting =
      this.eventSettingRepository.updateRegistrationEnabled(
        eventId,
        registrationEnabled,
        tx,
      );
    return plainToInstance(GetEventSettingDto, updatedEventSetting);
  }
}
