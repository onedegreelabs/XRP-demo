import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Prisma } from '@prisma/client';
import { GetUserDeviceDto } from '@user/application/dtos/get-user-device.dto';
import { CreateUserDeviceDto } from '@user/application/dtos/create-user-device.dto';
import { UserAgentDto } from '@user/interface/dtos/common/user-agent.dto';
import { UserDeviceRepository } from '@user/domain/repositories/user-device.repository';
import * as geoip from 'geoip-lite';
import { NotFoundException } from '@exception/custom/not-found.exception';
import { UserExceptionEnum } from '@exception/enum/user.enum';

@Injectable()
export class UserDeviceService {
  constructor(private readonly userDeviceRepository: UserDeviceRepository) {}

  async getUserDevices(id: string): Promise<GetUserDeviceDto[]> {
    const devices = await this.userDeviceRepository.findManyByUserId(id);
    return plainToInstance(GetUserDeviceDto, devices);
  }

  async createUserDevice(
    userId: string,
    ip: string,
    userAgent: UserAgentDto,
    tx?: Prisma.TransactionClient,
  ): Promise<GetUserDeviceDto> {
    const device = await this.userDeviceRepository.findByUserIdAndIp(
      userId,
      ip,
    );
    if (device) {
      return await this.userDeviceRepository.updateLastLoginAt(device.id, tx);
    }
    const ipBasedLocation = geoip.lookup(ip);
    const createDeviceDto = plainToInstance(CreateUserDeviceDto, {
      ip,
      region: ipBasedLocation?.region,
      ...userAgent,
    });
    const createdDevice = await this.userDeviceRepository.save(
      userId,
      createDeviceDto,
      tx,
    );
    return plainToInstance(GetUserDeviceDto, createdDevice);
  }

  async deleteUserDevice(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const foundDevice = await this.userDeviceRepository.findById(id);
    if (!foundDevice) {
      throw new NotFoundException(UserExceptionEnum.UserDeviceNotFound);
    }
    await this.userDeviceRepository.delete(id, tx);
  }
}
