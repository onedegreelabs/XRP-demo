import { Injectable } from '@nestjs/common';
import { GetCreateUserTokenDto } from '@user/application/dtos/get-create-user-token.dto';
import { UserDeviceService } from '@user/application/services/user-device.service';
import { TpaService } from '@user/application/services/tpa.service';
import { PrismaService } from '@persistence/prisma/prisma.service';
import { UserService } from '@user/application/services/user.service';
import { TokenService } from '@user/application/services/token.service';
import { AuthTokenPayloadDto } from '@user/interface/dtos/common/auth-token-payload.dto';
import { OtpService } from '@user/application/services/otp.service';
import { GetAuthTokensDto } from '@user/application/dtos/get-auth-tokens.dto';
import { OtpMethod } from '@user/interface/constants/otp.constant';
import { LoginInfoDto } from '@user/interface/dtos/common/login-info.dto';
import { plainToInstance } from 'class-transformer';
import { CreateTpaDto } from '@user/application/dtos/create-tpa.dto';
import { UserWalletService } from '@user/application/services/user-wallet.service';

@Injectable()
export class AuthFeature {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly userDeviceService: UserDeviceService,
    private readonly thirdPartyAccountService: TpaService,
    private readonly otpService: OtpService,
    private readonly walletService: UserWalletService,
  ) {}

  async sendOtp(method: OtpMethod, to: string): Promise<void> {
    await this.otpService.send(method, to);
  }

  async login(
    loginInfoDto: LoginInfoDto,
  ): Promise<GetAuthTokensDto | GetCreateUserTokenDto> {
    const { email, ip, userAgent, oauthInfo } = loginInfoDto;
    let result: GetAuthTokensDto | GetCreateUserTokenDto;

    const foundUser = await this.userService.getUserByEmail(email);
    if (!foundUser) {
      return this.tokenService.createCreateUserToken(email, oauthInfo);
    }

    await this.prisma.$transaction(async (tx) => {
      await this.walletService.createWallet(foundUser.id, tx);
      const createdDevice = await this.userDeviceService.createUserDevice(
        foundUser.id,
        ip,
        userAgent,
        tx,
      );
      if (oauthInfo) {
        const createTpaDto = plainToInstance(CreateTpaDto, {
          provider: oauthInfo.provider,
          providerId: oauthInfo.providerId,
          accessToken: oauthInfo.accessToken,
          refreshToken: oauthInfo.refreshToken,
        });
        await this.thirdPartyAccountService.createTpa(
          foundUser.id,
          createTpaDto,
          tx,
        );
      }
      result = await this.tokenService.createAuthToken(
        email,
        foundUser,
        createdDevice,
      );
    });
    return result;
  }

  async deleteAuthTokens(payload: AuthTokenPayloadDto) {
    await this.tokenService.deleteAuthToken(payload);
  }
}
