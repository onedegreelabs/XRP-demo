import { Injectable } from '@nestjs/common';
import { PrismaService } from '@persistence/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class LikeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(
    userId: string,
    targetUserId: string,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx || this.prisma).like.create({
      data: {
        user: { connect: { id: userId } },
        targetUser: { connect: { id: targetUserId } },
      },
    });
  }

  async delete(
    userId: string,
    targetUserId: string,
    tx?: Prisma.TransactionClient,
  ) {
    await (tx || this.prisma).like.delete({
      where: {
        userId_targetUserId: {
          userId,
          targetUserId,
        },
      },
    });
  }

  async findByUserIdAndTargetUserId(
    userId: string,
    targetUserId: string,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx || this.prisma).like.findUnique({
      where: {
        userId_targetUserId: {
          userId,
          targetUserId,
        },
      },
    });
  }

  async findLikesByUserId(userId: string) {
    return this.prisma.like.findMany({
      where: { userId },
      include: {
        targetUser: {
          include: { tags: { include: { tag: true } } },
        },
      },
    });
  }
}
