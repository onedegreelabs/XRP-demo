import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateTpaDto } from '@user/application/dtos/create-tpa.dto';
import { Prisma } from '@prisma/client';
import { GetTpaDto } from '@user/application/dtos/get-tpa.dto';
import { TpaRepository } from '@user/domain/repositories/tpa.repository';
import { NotFoundException } from '@exception/custom/not-found.exception';
import { UserExceptionEnum } from '@exception/enum/user.enum';

@Injectable()
export class TpaService {
  constructor(private readonly tpaRepository: TpaRepository) {}

  async getTpaList(userId: string): Promise<GetTpaDto[]> {
    const tpas = await this.tpaRepository.findByUserId(userId);
    return plainToInstance(GetTpaDto, tpas);
  }

  async createTpa(
    userId: string,
    createTpaDto: CreateTpaDto,
    tx?: Prisma.TransactionClient,
  ): Promise<GetTpaDto> {
    const foundTpa = await this.tpaRepository.findByUserIdAndProvider(
      userId,
      createTpaDto.provider,
    );

    if (foundTpa) {
      return;
    }

    const createdTpa = await this.tpaRepository.save(userId, createTpaDto, tx);
    return plainToInstance(GetTpaDto, createdTpa);
  }

  async deleteTpa(id: string, tx?: Prisma.TransactionClient): Promise<void> {
    const foundTpa = await this.tpaRepository.findById(id);
    if (!foundTpa) {
      throw new NotFoundException(UserExceptionEnum.ThirdPartyAccountNotFound);
    }
    await this.tpaRepository.delete(id, tx);
  }
}
