import { Injectable } from '@nestjs/common';
import { PrismaService } from '@persistence/prisma/prisma.service';
import { EventTicketNftStatus, Prisma } from '@prisma/client';

@Injectable()
export class EventTicketNftRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(
    ownerId: string,
    ticketId: string,
    nftId: string,
    uri: string,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx || this.prisma).eventTicketNft.create({
      data: {
        owner: { connect: { id: ownerId } },
        ticket: { connect: { id: ticketId } },
        nftId,
        uri,
      },
    });
  }

  async deleteByNftId(nftId: string, tx?: Prisma.TransactionClient) {
    return (tx || this.prisma).eventTicketNft.delete({
      where: {
        nftId,
      },
    });
  }

  async findByNftId(nftId: string) {
    return this.prisma.eventTicketNft.findUnique({
      where: {
        nftId,
      },
    });
  }

  async findUnusedByTicketId(ticketId: string) {
    return this.prisma.eventTicketNft.findFirst({
      where: {
        ticketId,
        status: EventTicketNftStatus.ACTIVE,
      },
      include: { owner: true },
    });
  }

  async updateOwner(
    nftId: string,
    newOwnerId: string,
    tx?: Prisma.TransactionClient,
  ) {
    return (tx || this.prisma).eventTicketNft.update({
      where: {
        nftId,
      },
      data: {
        owner: { connect: { id: newOwnerId } },
        status: EventTicketNftStatus.USED,
      },
    });
  }
}
