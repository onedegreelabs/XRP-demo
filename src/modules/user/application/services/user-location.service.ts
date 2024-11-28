import { Injectable } from '@nestjs/common';
import { UserLocationRepository } from '@user/domain/repositories/user-location.repository';
import { Prisma } from '@prisma/client';
import { UpsertUserLocationDto } from '@user/application/dtos/upsert-user-location.dto';
import { GetUserLocationDto } from '@user/application/dtos/get-user-location.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserLocationService {
  constructor(
    private readonly userLocationRepository: UserLocationRepository,
  ) {}

  async upsertUserLocation(
    userId: string,
    upsertUserLocationDto: UpsertUserLocationDto,
    tx?: Prisma.TransactionClient,
  ): Promise<GetUserLocationDto> {
    const upsertedUserLocation = this.userLocationRepository.upsert(
      userId,
      upsertUserLocationDto,
      tx,
    );
    return plainToInstance(GetUserLocationDto, upsertedUserLocation);
  }

  async getByUserId(userId: string): Promise<GetUserLocationDto> {
    const foundUserLocation =
      await this.userLocationRepository.findByUserId(userId);
    return plainToInstance(GetUserLocationDto, foundUserLocation);
  }

  async deleteByUserId(
    userId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    await this.userLocationRepository.deleteByUserId(userId, tx);
  }
}
