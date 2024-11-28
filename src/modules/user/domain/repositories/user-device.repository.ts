import { Injectable } from '@nestjs/common';
import { PrismaService } from '@persistence/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateUserDeviceDto } from '@user/application/dtos/create-user-device.dto';

@Injectable()
export class UserDeviceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(
    userId: string,
    data: CreateUserDeviceDto,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx || this.prisma).userDevice.create({
      data: {
        ...data,
        user: { connect: { id: userId } },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.userDevice.findUnique({
      where: { id },
    });
  }

  async findManyByUserId(userId: string) {
    return this.prisma.userDevice.findMany({
      where: { userId },
      orderBy: { lastLoginAt: 'desc' },
    });
  }

  async findByUserIdAndIp(userId: string, ip: string) {
    return this.prisma.userDevice.findUnique({
      where: { userId_ip: { userId, ip } },
    });
  }

  async updateLastLoginAt(id: string, tx?: Prisma.TransactionClient) {
    return (tx || this.prisma).userDevice.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  async delete(id: string, tx?: Prisma.TransactionClient) {
    await (tx || this.prisma).userDevice.delete({
      where: { id },
    });
  }
}
