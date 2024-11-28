import { Injectable } from '@nestjs/common';
import { UserWalletRepository } from '@user/domain/repositories/user-wallet.repository';
import { plainToInstance } from 'class-transformer';
import { CreateUserWalletDto } from '@user/application/dtos/create-user-wallet.dto';
import { XrplWalletService } from '@config/crypto/xrpl/services/xrpl-wallet.service';
import { GetUserWalletDto } from '@user/application/dtos/get-user-wallet.dto';
import { Prisma } from '@prisma/client';
import { NotFoundException } from '@exception/custom/not-found.exception';
import { UserExceptionEnum } from '@exception/enum/user.enum';

@Injectable()
export class UserWalletService {
  constructor(
    private readonly xrplWalletService: XrplWalletService,
    private readonly walletRepository: UserWalletRepository,
  ) {}

  async createWallet(
    userId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<GetUserWalletDto> {
    const foundWallet = await this.walletRepository.findByUserId(userId);
    if (foundWallet) {
      return plainToInstance(GetUserWalletDto, foundWallet);
    }

    // const await xrplWalletService.createWallet();
    const { wallet } = await this.xrplWalletService.fundWallet();
    const createWalletDto = plainToInstance(CreateUserWalletDto, {
      address: wallet.address,
      seed: wallet.seed,
    });
    const createdWallet = this.walletRepository.save(
      userId,
      createWalletDto,
      tx,
    );
    return plainToInstance(GetUserWalletDto, createdWallet);
  }

  async getWallet(userId: string): Promise<GetUserWalletDto> {
    const foundWallet = await this.walletRepository.findByUserId(userId);
    if (!foundWallet) {
      throw new NotFoundException(UserExceptionEnum.UserWalletNotFound);
    }
    return plainToInstance(GetUserWalletDto, foundWallet);
  }
}
