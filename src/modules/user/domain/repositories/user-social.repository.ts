import { Injectable } from '@nestjs/common';
import { PrismaService } from '@persistence/prisma/prisma.service';
import { UpsertUserSocialDto } from '@user/application/dtos/upsert-user-social.dto';
import { Prisma, SocialType } from '@prisma/client';

@Injectable()
export class UserSocialRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(
    userId: string,
    data: UpsertUserSocialDto,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx || this.prisma).userSocial.create({
      data: {
        user: { connect: { id: userId } },
        ...data,
      },
    });
  }

  async deleteByUserId(userId: string, tx?: Prisma.TransactionClient) {
    await (tx || this.prisma).userSocial.deleteMany({ where: { userId } });
  }

  async deleteByUserIdAndType(
    userId: string,
    type: SocialType,
    tx?: Prisma.TransactionClient,
  ) {
    await (tx || this.prisma).userSocial.delete({
      where: { userId_type: { userId, type } },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.userSocial.findMany({ where: { userId } });
  }
}
