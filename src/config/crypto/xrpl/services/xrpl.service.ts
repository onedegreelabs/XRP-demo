import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Client } from 'xrpl';
import { EnvService } from '@env/services/env.service';
import { ENVIRONMENT_KEY } from '@env/variables';
import { InternalServerErrorException } from '@exception/custom/internal-server-error.exception';
import { GlobalExceptionEnum } from '@exception/enum/global.enum';

/**
 * - This is the main service for connecting to XRPL.
 * - It is responsible for creating a connection to the XRPL node and managing the wallet.
 * - For this to function, environment variables need to be configured. (XRPL_NODE)
 */
@Injectable()
export class XrplService implements OnModuleInit, OnModuleDestroy {
  private client: Client;

  constructor(private readonly envService: EnvService) {}

  async onModuleInit() {
    this.client = new Client(
      this.envService.get<string>(ENVIRONMENT_KEY.XRPL_NODE),
    );
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.disconnect();
  }

  /**
   * @description Get XRPL Client connection
   */
  getClient(): Client {
    return this.client;
  }

  /**
   * @description Get Account Info
   * @param address - XRPL Address
   */
  async getAccountInfo(address: string) {
    try {
      return this.getClient().request({
        command: 'account_info',
        account: address,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        GlobalExceptionEnum.XRPLClientRequest,
      );
    }
  }
}
