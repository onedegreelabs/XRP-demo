import { Injectable } from '@nestjs/common';
import { PrismaService } from '@persistence/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserTagRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(
    userId: string,
    tagId: string,
    position: bigint,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx || this.prisma).userTag.create({
      data: {
        user: { connect: { id: userId } },
        tag: { connect: { id: tagId } },
        position,
      },
    });
  }

  async findManyByUserId(userId: string) {
    return this.prisma.userTag.findMany({
      where: { userId },
      include: { tag: true },
      orderBy: { position: 'asc' },
    });
  }

  async delete(userId: string, tagId: string, tx?: Prisma.TransactionClient) {
    await (tx || this.prisma).userTag.delete({
      where: {
        userId_tagId: {
          userId,
          tagId,
        },
      },
    });
  }

  async upsert(
    userId: string,
    tagId: string,
    position: bigint,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx || this.prisma).userTag.upsert({
      where: {
        userId_tagId: {
          userId,
          tagId,
        },
      },
      update: { position },
      create: {
        user: { connect: { id: userId } },
        tag: { connect: { id: tagId } },
        position,
      },
    });
  }
}
