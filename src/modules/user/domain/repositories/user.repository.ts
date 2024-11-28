import { Injectable } from '@nestjs/common';
import { PrismaService } from '@persistence/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from '@user/application/dtos/create-user.dto';
import { UpdateUserDto } from '@user/application/dtos/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(data: CreateUserDto, tx?: Prisma.TransactionClient) {
    return (tx || this.prisma).user.create({
      data,
    });
  }

  async update(
    userId: string,
    data: UpdateUserDto,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx || this.prisma).user.update({
      where: { id: userId },
      data,
    });
  }

  // TODO: 회원탈퇴 -> soft-delete vs hard-delete
  // async delete(userId: string, tx?: Prisma.TransactionClient) {
  //   await (tx || this.prisma).user.delete({
  //     where: { id: userId },
  //   });
  // }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        location: true,
        socials: true,
        tags: { include: { tag: true } },
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { auth: { email } },
    });
  }

  async findByHandle(handle: string) {
    return this.prisma.user.findUnique({
      where: { handle },
      include: {
        location: true,
        socials: true,
        tags: { include: { tag: true } },
      },
    });
  }

  async findLikedUsersByUserId(userId: string) {
    return this.prisma.user.findMany({
      where: { likedBy: { some: { userId } } },
      include: {
        location: true,
        socials: true,
        tags: { include: { tag: true } },
      },
    });
  }
}
