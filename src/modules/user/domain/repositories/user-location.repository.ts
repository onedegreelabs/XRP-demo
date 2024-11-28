import { Injectable } from '@nestjs/common';
import { PrismaService } from '@persistence/prisma/prisma.service';
import { UpsertUserLocationDto } from '@user/application/dtos/upsert-user-location.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserLocationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(
    userId: string,
    data: UpsertUserLocationDto,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx || this.prisma).userLocation.upsert({
      where: { userId },
      create: {
        ...data,
        user: { connect: { id: userId } },
      },
      update: {
        ...data,
        fullAddress: data.fullAddress,
      },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.userLocation.findUnique({ where: { userId } });
  }

  async deleteByUserId(userId: string, tx?: Prisma.TransactionClient) {
    await (tx || this.prisma).userLocation.delete({ where: { userId } });
  }
}
