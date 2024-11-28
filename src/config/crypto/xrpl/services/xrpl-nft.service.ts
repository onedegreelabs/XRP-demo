import { Injectable, Logger } from '@nestjs/common';
import { convertStringToHex, Wallet, xrpToDrops } from 'xrpl';
import type { SubmittableTransaction } from 'xrpl/src/models/transactions';
import { InternalServerErrorException } from '@exception/custom/internal-server-error.exception';
import { GlobalExceptionEnum } from '@exception/enum/global.enum';
import { XrplService } from '@config/crypto/xrpl/services/xrpl.service';
import { XrplTicketService } from '@config/crypto/xrpl/services/xrpl-ticket.service';

/**
 * - This service is responsible for managing NFTs on the XRPL.
 */
@Injectable()
export class XrplNftService {
  private readonly logger = new Logger(XrplNftService.name);

  constructor(
    private readonly xrplService: XrplService,
    private readonly xrplTicketService: XrplTicketService,
  ) {}

  /**
   * @description Mint NFT
   * @param seed
   * @param uri
   */
  async mintNFT(seed: string, uri: string): Promise<string> {
    try {
      const wallet = Wallet.fromSeed(seed);
      const prepared = await this.xrplService.getClient().autofill({
        TransactionType: 'NFTokenMint',
        Account: wallet.classicAddress,
        URI: convertStringToHex(uri),
        NFTokenTaxon: 1,
      } as SubmittableTransaction);
      const signed = wallet.sign(prepared);
      const tx = await this.xrplService
        .getClient()
        .submitAndWait(signed.tx_blob, { wallet });
      return tx.result.meta['nftoken_id'];
    } catch (error) {
      throw new InternalServerErrorException(
        GlobalExceptionEnum.XRPLClientRequest,
      );
    }
  }

  /**
   * @description Batch Mint NFT
   * @param seed
   * @param uri
   * @param count
   */
  async batchMintNFT(seed: string, uri: string, count: number) {
    try {
      const wallet = Wallet.fromSeed(seed);
      let tickets = await this.xrplTicketService.getTickets(
        wallet.classicAddress,
      );

      this.logger.log(
        `Found ${tickets.length} tickets. Required tickets: ${count}`,
      );

      // Generate tickets if tickets are insufficient
      if (tickets.length < count) {
        this.logger.log(`Generating ${count - tickets.length} tickets...`);
        await this.xrplTicketService.createXrplTicket(
          seed,
          count - tickets.length,
        );
        tickets = await this.xrplTicketService.getTickets(
          wallet.classicAddress,
        );
        this.logger.log(`${tickets.length} tickets have been generated.`);
      } else if (tickets.length > count) {
        // Use only the required number of tickets
        tickets = tickets.slice(0, count);
      }

      const nftIds = [];
      this.logger.log(`${tickets.length} tickets will be used to mint NFTs.`);
      for (const ticket of tickets) {
        const prepared = await this.xrplService.getClient().autofill({
          TransactionType: 'NFTokenMint',
          Account: wallet.classicAddress,
          URI: convertStringToHex(uri),
          TicketSequence: ticket.TicketSequence,
          LastLedgerSequence: null,
          Sequence: 0,
          NFTokenTaxon: 1,
        });
        const signed = wallet.sign(prepared);
        const tx = await this.xrplService
          .getClient()
          .submitAndWait(signed.tx_blob, { wallet });
        nftIds.push(tx.result.meta['nftoken_id']);
        this.logger.log(
          `Ticket(#${ticket.TicketSequence}): NFT has been minted.`,
        );
      }
      return nftIds;
    } catch (error) {
      throw new InternalServerErrorException(
        GlobalExceptionEnum.XRPLClientRequest,
      );
    }
  }

  /**
   * @description get NFTs
   * @param address - The address of the account.
   * @param take - The number of items to fetch.
   * @param marker - The marker for pagination.
   */
  async getNFTs(address: string, take?: number, marker?: string) {
    try {
      let nfts = this.xrplService.getClient().request({
        command: 'account_nfts',
        account: address,
        limit: take,
      });

      // if there is a marker, fetch the next page
      while (marker) {
        nfts = this.xrplService.getClient().request({
          command: 'account_nfts',
          account: address,
          limit: take,
          marker,
        });
      }

      return nfts;
    } catch (error) {
      throw new InternalServerErrorException(
        GlobalExceptionEnum.XRPLClientRequest,
      );
    }
  }

  /**
   * @description Get offers
   * @param address
   * @returns account_offers
   */
  async getOffers(address: string) {
    try {
      const offers = await this.xrplService.getClient().request({
        command: 'account_offers',
        account: address,
        ledger_index: 'validated',
      });
      console.log(offers);
      return offers;
    } catch (error) {
      throw new InternalServerErrorException(
        GlobalExceptionEnum.XRPLClientRequest,
      );
    }
  }

  /**
   * @description Request buy offer
   * @param seed - The seed of the account.
   * @param nftId - The ID of the NFT.
   * @param destination - The destination address.
   * @param amount - The amount to offer.
   * @returns The ID of the offer.
   */
  async buyOffer(
    seed: string,
    nftId: string,
    destination: string,
    amount: number,
  ): Promise<string> {
    try {
      const wallet = Wallet.fromSeed(seed);
      const prepared = await this.xrplService.getClient().autofill({
        TransactionType: 'NFTokenCreateOffer',
        NFTokenID: nftId,
        Account: wallet.classicAddress,
        Destination: destination,
        Amount: xrpToDrops(amount),
        Flags: null,
      } as SubmittableTransaction);
      const signed = wallet.sign(prepared);
      const tx = await this.xrplService
        .getClient()
        .submitAndWait(signed.tx_blob, { wallet });
      return tx.result.meta['offer_id'];
    } catch (error) {
      throw new InternalServerErrorException(
        GlobalExceptionEnum.XRPLClientRequest,
      );
    }
  }

  /**
   * @description Request sell offer
   * @param seed - The seed of the account.
   * @param nftId - The ID of the NFT.
   * @param destination - The destination address.
   * @param amount - The amount to offer.
   * @returns The ID of the offer.
   */
  async sellOffer(
    seed: string,
    nftId: string,
    destination: string,
    amount: number,
  ) {
    try {
      const wallet = Wallet.fromSeed(seed);
      const prepared = await this.xrplService.getClient().autofill({
        TransactionType: 'NFTokenCreateOffer',
        NFTokenID: nftId,
        Account: wallet.classicAddress,
        Destination: destination,
        Amount: xrpToDrops(amount),
        Flags: 1,
      } as SubmittableTransaction);
      const signed = wallet.sign(prepared);
      const tx = await this.xrplService
        .getClient()
        .submitAndWait(signed.tx_blob, { wallet });
      return tx.result.meta['offer_id'];
    } catch (error) {
      throw new InternalServerErrorException(
        GlobalExceptionEnum.XRPLClientRequest,
      );
    }
  }

  /**
   * @description Accept sell offer
   * @param seed - The seed of the account.
   * @param offerId - The ID of the offer.
   */
  async acceptSellOffer(seed: string, offerId: string) {
    try {
      const wallet = Wallet.fromSeed(seed);
      const prepared = await this.xrplService.getClient().autofill({
        TransactionType: 'NFTokenAcceptOffer',
        Account: wallet.classicAddress,
        NFTokenSellOffer: offerId,
      } as SubmittableTransaction);
      const signed = wallet.sign(prepared);
      await this.xrplService
        .getClient()
        .submitAndWait(signed.tx_blob, { wallet });
    } catch (error) {
      throw new InternalServerErrorException(
        GlobalExceptionEnum.XRPLClientRequest,
      );
    }
  }

  /**
   * @description Accept buy offer
   * @param seed - The seed of the account.
   * @param offerId - The ID of the offer.
   */
  async acceptBuyOffer(seed: string, offerId: string) {
    try {
      const wallet = Wallet.fromSeed(seed);
      const prepared = await this.xrplService.getClient().autofill({
        TransactionType: 'NFTokenAcceptOffer',
        Account: wallet.classicAddress,
        NFTokenBuyOffer: offerId,
      } as SubmittableTransaction);
      const signed = wallet.sign(prepared);
      await this.xrplService
        .getClient()
        .submitAndWait(signed.tx_blob, { wallet });
    } catch (error) {
      throw new InternalServerErrorException(
        GlobalExceptionEnum.XRPLClientRequest,
      );
    }
  }
}
