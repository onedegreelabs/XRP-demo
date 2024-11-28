import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AUTH_CONSTRAINTS } from '@user/interface/constants/auth.constant';
import { AuthExceptionEnum } from '@exception/enum/auth.enum';
import { OtpCacheService } from '@user/infrastructure/cache/services/otp.cache.service';
import { UnauthorizedException } from '@exception/custom/unauthorized.exception';
import { VerificationCountCacheService } from '@user/infrastructure/cache/services/verification-count.cache.service';
import { VerificationBlockedCacheService } from '@user/infrastructure/cache/services/verification-blocked.cache.service';
import { OtpMethod } from '@user/interface/constants/otp.constant';

@Injectable()
export class EmailAuthGuard implements CanActivate {
  constructor(
    private readonly otpCacheService: OtpCacheService,
    private readonly verificationCountCacheService: VerificationCountCacheService,
    private readonly verificationBlockedCacheService: VerificationBlockedCacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw new UnauthorizedException(AuthExceptionEnum.MissingCredentials);
    }

    const credentials = this.decodeBasicAuth(authHeader);
    const { email, code } = credentials;

    // Verify if the user is blocked
    await this.validateBlocked(email);

    // Verify request count
    await this.validateRequestCount(email);

    // Verify code
    await this.verifyCode(email, code);

    // Clear verification data after successful verification
    await this.otpCacheService.delete(OtpMethod.EMAIL, email);
    await this.verificationCountCacheService.delete(OtpMethod.EMAIL, email);

    request.auth = { email }; // Attach email to request if needed
    return true;
  }

  private decodeBasicAuth(authHeader: string): { email: string; code: string } {
    const base64Credentials = authHeader.split(' ')[1];
    const decoded = Buffer.from(base64Credentials, 'base64').toString('utf8');
    const [email, code] = decoded.split(':');

    if (!email || !code) {
      throw new UnauthorizedException(AuthExceptionEnum.MissingCredentials);
    }

    return { email, code };
  }

  private async validateBlocked(email: string): Promise<void> {
    const isBlocked = await this.verificationBlockedCacheService.get(
      OtpMethod.EMAIL,
      email,
    );
    if (isBlocked) {
      throw new UnauthorizedException(
        AuthExceptionEnum.BlockedVerificationRequest,
      );
    }
  }

  private async validateRequestCount(email: string): Promise<void> {
    const currRequestCount = await this.verificationCountCacheService.getNext(
      OtpMethod.EMAIL,
      email,
    );

    if (currRequestCount > AUTH_CONSTRAINTS.VERIFICATION_MAX_COUNT) {
      await this.verificationBlockedCacheService.set(OtpMethod.EMAIL, email);
      throw new UnauthorizedException(
        AuthExceptionEnum.TooManyVerificationRequest,
      );
    }
  }

  private async verifyCode(email: string, code: string): Promise<void> {
    const storedCode = await this.otpCacheService.get(OtpMethod.EMAIL, email);
    if (!storedCode || storedCode !== parseInt(code)) {
      await this.verificationCountCacheService.increment(
        OtpMethod.EMAIL,
        email,
      );
      throw new UnauthorizedException(AuthExceptionEnum.InvalidOtp);
    }
  }
}
