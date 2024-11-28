import { Module } from '@nestjs/common';
import { OtpCacheService } from '@user/infrastructure/cache/services/otp.cache.service';
import { VerificationCountCacheService } from '@user/infrastructure/cache/services/verification-count.cache.service';
import { VerificationBlockedCacheService } from '@user/infrastructure/cache/services/verification-blocked.cache.service';
import { RefreshTokenCacheService } from '@user/infrastructure/cache/services/refresh-token.cache.service';
import { AuthRepository } from '@user/domain/repositories/auth.repository';
import { SendOtpCountCacheService } from '@user/infrastructure/cache/services/send-otp-count.cache.service';
import { SendOtpBlockedCacheService } from '@user/infrastructure/cache/services/send-otp-blocked.cache.service';
import { UserDeviceRepository } from '@user/domain/repositories/user-device.repository';
import { UserRepository } from '@user/domain/repositories/user.repository';
import { TpaRepository } from '@user/domain/repositories/tpa.repository';
import { AuthService } from '@user/application/services/auth.service';
import { UserService } from '@user/application/services/user.service';
import { TpaService } from '@user/application/services/tpa.service';
import { TokenService } from '@user/application/services/token.service';
import { UserDeviceService } from '@user/application/services/user-device.service';
import { AuthTokenCookieService } from '@user/infrastructure/cookie/services/auth-token.cookie';
import { AuthFeature } from '@user/application/features/auth.feature';
import { OtpService } from '@user/application/services/otp.service';
import { UserDeviceFeature } from '@user/application/features/user-device.feature';
import { UserFeature } from '@user/application/features/user.feature';
import { LikeService } from '@user/application/services/like.service';
import { LikeFeature } from '@user/application/features/like.feature';
import { LikeRepository } from '@user/domain/repositories/like.repository';
import { UserProfileFeature } from '@user/application/features/user-profile.feature';
import { TagRepository } from '@user/domain/repositories/tag.repository';
import { UserTagRepository } from '@user/domain/repositories/user-tag.repository';
import { UserTagService } from '@user/application/services/user-tag.service';
import { AuthController } from '@user/interface/controllers/auth.controller';
import { UserController } from '@user/interface/controllers/user.controller';
import { ProfileController } from '@user/interface/controllers/profile.controller';
import { MyDeviceController } from '@user/interface/controllers/my-device.controller';
import { LikeController } from '@user/interface/controllers/like.controller';
import { MySettingsController } from '@user/interface/controllers/my-settings.controller';
import { UserLocationRepository } from '@user/domain/repositories/user-location.repository';
import { UserLocationService } from '@user/application/services/user-location.service';
import { UserSocialService } from '@user/application/services/user-social.service';
import { UserSocialRepository } from '@user/domain/repositories/user-social.repository';
import { UserWalletService } from '@user/application/services/user-wallet.service';
import { UserWalletRepository } from '@user/domain/repositories/user-wallet.repository';
import { XrplModule } from '@config/crypto/xrpl/xrpl.module';
import { UserWalletController } from '@user/interface/controllers/user-wallet.controller';

@Module({
  imports: [XrplModule],
  controllers: [
    AuthController,
    UserController,
    ProfileController,
    MySettingsController,
    MyDeviceController,
    LikeController,
    UserWalletController,
  ],
  providers: [
    AuthFeature,
    AuthService,
    AuthRepository,
    UserFeature,
    UserService,
    UserRepository,
    UserProfileFeature,
    UserDeviceFeature,
    UserDeviceService,
    UserDeviceRepository,
    UserWalletService,
    UserWalletRepository,
    TpaService,
    TpaRepository,
    LikeFeature,
    LikeService,
    LikeRepository,
    TagRepository,
    UserTagService,
    UserTagRepository,
    UserLocationService,
    UserLocationRepository,
    UserSocialService,
    UserSocialRepository,
    TokenService,
    OtpService,
    OtpCacheService,
    RefreshTokenCacheService,
    VerificationCountCacheService,
    VerificationBlockedCacheService,
    SendOtpBlockedCacheService,
    SendOtpCountCacheService,
    AuthTokenCookieService,
  ],
  exports: [UserWalletRepository, UserWalletService],
})
export class UserModule {}
