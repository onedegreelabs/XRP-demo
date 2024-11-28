import { Injectable } from '@nestjs/common';
import { Wallet, xrpToDrops } from 'xrpl';
import { InternalServerErrorException } from '@exception/custom/internal-server-error.exception';
import { GlobalExceptionEnum } from '@exception/enum/global.enum';
import { XrplService } from '@config/crypto/xrpl/services/xrpl.service';
import type { SubmittableTransaction } from 'xrpl/src/models/transactions';

/**
 * - This service is responsible for managing wallets on the XRPL.
 */
@Injectable()
export class XrplWalletService {
  constructor(private readonly xrplService: XrplService) {}

  async getBalance(address: string) {
    try {
      return this.xrplService.getClient().getXrpBalance(address);
    } catch (error) {
      throw new InternalServerErrorException(
        GlobalExceptionEnum.XRPLClientRequest,
      );
    }
  }

  /**
   * @description Create XRPL Wallet\
   * @returns XRPL Wallet Address
   */
  async createWallet(): Promise<string> {
    try {
      const wallet = Wallet.generate();
      return wallet.address;
    } catch (error) {
      throw new InternalServerErrorException(
        GlobalExceptionEnum.XRPLClientRequest,
      );
    }
  }

  /**
   * @description Fund XRPL Wallet
   * @returns XRPL Wallet Address
   */
  async fundWallet() {
    try {
      return this.xrplService.getClient().fundWallet();
    } catch (error) {
      throw new InternalServerErrorException(
        GlobalExceptionEnum.XRPLClientRequest,
      );
    }
  }

  /**
   * @description Transfer XRP
   * @param seed - The seed of the account.
   * @param destination - The destination address.
   * @param amount - The amount to transfer.
   */
  async transferXRP(seed: string, destination: string, amount: number) {
    const senderWallet = Wallet.fromSeed(seed);
    const prepared = (await this.xrplService.getClient().autofill({
      TransactionType: 'Payment',
      Account: senderWallet.classicAddress,
      Destination: destination,
      Amount: xrpToDrops(amount),
    })) as SubmittableTransaction;
    const signed = senderWallet.sign(prepared);
    const tx = await this.xrplService.getClient().submitAndWait(signed.tx_blob);
    if (tx.result.meta['TransactionResult'] === 'tecUNFUNDED_PAYMENT') {
      throw new InternalServerErrorException(
        GlobalExceptionEnum.XRPLInSufficientBalance,
      );
    }
    if (tx.result.meta['TransactionResult'] !== 'tesSUCCESS') {
      throw new InternalServerErrorException(
        GlobalExceptionEnum.XRPLClientRequest,
      );
    }
  }
}
