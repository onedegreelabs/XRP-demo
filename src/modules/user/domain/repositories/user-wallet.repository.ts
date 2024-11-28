import { Injectable } from '@nestjs/common';
import { PrismaService } from '@persistence/prisma/prisma.service';
import { CreateUserWalletDto } from '@user/application/dtos/create-user-wallet.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserWalletRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(
    userId: string,
    createWalletDto: CreateUserWalletDto,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx || this.prisma).userWallet.create({
      data: {
        user: { connect: { id: userId } },
        ...createWalletDto,
      },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.userWallet.findUnique({
      where: {
        userId,
      },
    });
  }
}
