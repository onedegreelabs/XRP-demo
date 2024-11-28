import { Injectable } from '@nestjs/common';
import { PrismaService } from '@persistence/prisma/prisma.service';
import { Prisma, ThirdPartyProvider } from '@prisma/client';
import { CreateTpaDto } from '@user/application/dtos/create-tpa.dto';

@Injectable()
export class TpaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(
    userId: string,
    data: CreateTpaDto,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx || this.prisma).thirdPartyAccount.create({
      data: {
        provider: data.provider,
        providerId: data.providerId,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: { connect: { id: userId } },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.thirdPartyAccount.findFirst({ where: { id } });
  }

  async findByUserIdAndProvider(userId: string, provider: ThirdPartyProvider) {
    return this.prisma.thirdPartyAccount.findFirst({
      where: { userId, provider },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.thirdPartyAccount.findMany({
      where: { userId },
    });
  }

  async delete(id: string, tx?: Prisma.TransactionClient) {
    await (tx || this.prisma).thirdPartyAccount.delete({ where: { id } });
  }
}
