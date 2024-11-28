import { PrismaService } from '@persistence/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from '@user/application/dtos/create-auth.dto';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(
    userId: string,
    data: CreateAuthDto,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx || this.prisma).auth.create({
      data: {
        email: data.email,
        user: { connect: { id: userId } },
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.auth.findUnique({ where: { email } });
  }
}
