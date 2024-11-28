import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { XrplWalletService } from '@config/crypto/xrpl/services/xrpl-wallet.service';
import { User } from '@shared/decorators/user.request.decorator';
import { AuthTokenPayloadDto } from '@user/interface/dtos/common/auth-token-payload.dto';
import { FreeMembership } from '@shared/security/roles/free-membership.role.decorator';
import { UserWalletService } from '@user/application/services/user-wallet.service';
import { XrplNftService } from '@config/crypto/xrpl/services/xrpl-nft.service';

@Controller('me/wallets')
export class UserWalletController {
  constructor(
    private readonly xrplWalletService: XrplWalletService,
    private readonly xrplNftService: XrplNftService,
    private readonly userWalletService: UserWalletService,
  ) {}

  /**
   * @description Create a new wallet for the user
   * @param payload - decoded JWT token
   * @param destination - destination address
   * @param amount - amount to transfer
   */
  @Post('withdraw')
  @FreeMembership()
  @HttpCode(HttpStatus.OK)
  async transferXRP(
    @User() payload: AuthTokenPayloadDto,
    @Body('destination') destination: string,
    @Body('amount') amount: number,
  ) {
    const foundWallet = await this.userWalletService.getWallet(payload.userId);
    await this.xrplWalletService.transferXRP(
      foundWallet.seed,
      destination,
      amount,
    );
  }

  /**
   * @description Get NFTs of the user
   * @param payload - decoded JWT token
   */
  @Get('nfts')
  @FreeMembership()
  @HttpCode(HttpStatus.OK)
  async getNFTs(@User() payload: AuthTokenPayloadDto) {
    const foundWallet = await this.userWalletService.getWallet(payload.userId);
    return this.xrplNftService.getNFTs(foundWallet.address, 10);
  }
}
