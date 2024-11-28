import { Injectable, Logger } from '@nestjs/common';
import type { SubmittableTransaction } from 'xrpl/src/models/transactions';
import { InternalServerErrorException } from '@exception/custom/internal-server-error.exception';
import { GlobalExceptionEnum } from '@exception/enum/global.enum';
import { XrplService } from '@config/crypto/xrpl/services/xrpl.service';
import { Wallet } from 'xrpl';

/**
 * - This service is responsible for managing Tickets on the XRPL.
 */
@Injectable()
export class XrplTicketService {
  private readonly logger = new Logger(XrplTicketService.name);

  constructor(private readonly xrplService: XrplService) {}

  /**
   * @description Get created Tickets
   * @param address - XRPL Address
   */
  async getTickets(address: string) {
    try {
      const response = await this.xrplService.getClient().request({
        command: 'account_objects',
        account: address,
        type: 'ticket',
      });

      const tickets = [];
      for (const ticket of response.result.account_objects) {
        tickets.push(ticket);
      }

      return tickets;
    } catch (error) {
      throw new InternalServerErrorException(
        GlobalExceptionEnum.XRPLClientRequest,
      );
    }
  }

  /**
   * @description Create XRPL Ticket
   * @param seed - The seed of the account.
   * @param count - The number of tickets to create.
   */
  async createXrplTicket(seed: string, count: number) {
    const wallet = Wallet.fromSeed(seed);
    const accountInfo = await this.xrplService.getAccountInfo(
      wallet.classicAddress,
    );
    const prepared = await this.xrplService.getClient().autofill({
      TransactionType: 'TicketCreate',
      Account: wallet.classicAddress,
      TicketCount: count,
      Sequence: accountInfo.result.account_data.Sequence,
    } as SubmittableTransaction);
    const signed = wallet.sign(prepared);
    await this.xrplService
      .getClient()
      .submitAndWait(signed.tx_blob, { wallet });
  }
}
