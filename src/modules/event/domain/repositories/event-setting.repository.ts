import { Injectable } from '@nestjs/common';
import { PrismaService } from '@persistence/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateEventSettingDto } from '@event/application/dtos/create-event-setting.dto';

@Injectable()
export class EventSettingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(
    eventId: string,
    data: CreateEventSettingDto,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx || this.prisma).eventSetting.create({
      data: {
        event: { connect: { id: eventId } },
        ...data,
      },
    });
  }
  async updateRegistrationEnabled(
    eventId: string,
    registrationEnabled: boolean,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx || this.prisma).eventSetting.update({
      where: { eventId },
      data: { registrationEnabled },
    });
  }
}
