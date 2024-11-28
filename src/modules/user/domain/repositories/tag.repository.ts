import { Injectable } from '@nestjs/common';
import { PrismaService } from '@persistence/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TagRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(name: string, tx?: Prisma.TransactionClient) {
    return (tx || this.prisma).tag.create({
      data: { name },
    });
  }

  async findByName(name: string) {
    return this.prisma.tag.findUnique({
      where: { name },
    });
  }

  async findManyByName(tagNames: string[]) {
    return this.prisma.tag.findMany({
      where: {
        name: { in: tagNames },
      },
    });
  }

  async upsert(name: string, tx?: Prisma.TransactionClient) {
    return (tx || this.prisma).tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // 태그 삭제는 없음.
}
