import { Injectable } from '@nestjs/common';
import { MailService } from '@mailer/services/mail.service';
import { OtpCacheService } from '@user/infrastructure/cache/services/otp.cache.service';
import { SendOtpBlockedCacheService } from '@user/infrastructure/cache/services/send-otp-blocked.cache.service';
import { SendOtpCountCacheService } from '@user/infrastructure/cache/services/send-otp-count.cache.service';
import { generateRandomNumber, transformImageURL } from '@util/index';
import { AUTH_CONSTRAINTS } from '@user/interface/constants/auth.constant';
import { MAIL_ASSETS } from '@mailer/constants/asset.constant';
import { UnauthorizedException } from '@exception/custom/unauthorized.exception';
import { AuthExceptionEnum } from '@exception/enum/auth.enum';
import { OtpMethod } from '@user/interface/constants/otp.constant';

@Injectable()
export class OtpService {
  constructor(
    private readonly mail: MailService,
    private readonly otpCacheService: OtpCacheService,
    private readonly sendOtpBlockedCacheService: SendOtpBlockedCacheService,
    private readonly sendOtpCountCacheService: SendOtpCountCacheService,
  ) {}

  async send(method: OtpMethod, to: string): Promise<void> {
    await this.validateBlocked(method, to);
    await this.validateRequestCount(method, to);

    const code = generateRandomNumber(100000, 999999);
    await this.sendOtpCountCacheService.increment(method, to);
    await this.otpCacheService.set(method, to, code);

    switch (method) {
      case OtpMethod.EMAIL:
        await this.sendEmail(to, code);
        break;
      case OtpMethod.SMS:
        // send sms
        break;
    }
  }

  private async validateBlocked(method: OtpMethod, to: string): Promise<void> {
    const isBlocked = await this.sendOtpBlockedCacheService.get(method, to);
    if (isBlocked) {
      throw new UnauthorizedException(AuthExceptionEnum.BlockedSendOtpRequest);
    }
  }

  private async validateRequestCount(
    method: OtpMethod,
    to: string,
  ): Promise<void> {
    const currRequestCount = await this.sendOtpCountCacheService.getNext(
      method,
      to,
    );

    if (currRequestCount > AUTH_CONSTRAINTS.SEND_OTP_MAX_COUNT) {
      await this.sendOtpBlockedCacheService.set(method, to);
      throw new UnauthorizedException(AuthExceptionEnum.TooManySendOtpRequest);
    }
  }

  private async sendEmail(to: string, code: number): Promise<void> {
    await this.mail.send({
      to,
      subject: `${code} is your sign in code`,
      template: this.mail.getTemplateName('send-verification-code'),
      context: {
        code,
        expires: AUTH_CONSTRAINTS.OTP_TTL / 60,
        logoUrl: transformImageURL(MAIL_ASSETS.LOGO_S3_KEY),
      },
    });
  }
}
