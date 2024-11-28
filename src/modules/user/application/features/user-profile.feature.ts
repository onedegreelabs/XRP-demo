import { Injectable } from '@nestjs/common';
import { UserService } from '@user/application/services/user.service';
import { UpdateProfileRequestBodyDto } from '@user/interface/dtos/request/update-profile.body.dto';
import { PrismaService } from '@persistence/prisma/prisma.service';
import { UpdateUserDto } from '@user/application/dtos/update-user.dto';
import { UserTagService } from '@user/application/services/user-tag.service';
import { GetUserProfileResponseDto } from '@user/interface/dtos/response/get-user-profile.response.dto';
import { UserLocationService } from '@user/application/services/user-location.service';
import { UpsertUserLocationDto } from '@user/application/dtos/upsert-user-location.dto';
import { NotFoundException } from '@exception/custom/not-found.exception';
import { UserExceptionEnum } from '@exception/enum/user.enum';
import { UserSocialService } from '@user/application/services/user-social.service';
import { UpsertUserSocialDto } from '@user/application/dtos/upsert-user-social.dto';
import { plainToInstance } from 'class-transformer';
import { EXPOSED_GROUPS } from '@shared/security/groups/exposed-group.enum';
import { UserWalletService } from '@user/application/services/user-wallet.service';
import { XrplWalletService } from '@config/crypto/xrpl/services/xrpl-wallet.service';

@Injectable()
export class UserProfileFeature {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly userTagService: UserTagService,
    private readonly userLocationService: UserLocationService,
    private readonly userSocialService: UserSocialService,
    private readonly userWalletService: UserWalletService,
    private readonly xrplWalletService: XrplWalletService,
  ) {}

  async getUserProfileByHandle(
    handle: string,
  ): Promise<GetUserProfileResponseDto> {
    const foundUser = await this.userService.getUserByHandle(handle);
    if (!foundUser) {
      throw new NotFoundException(UserExceptionEnum.UserNotFound);
    }
    return plainToInstance(GetUserProfileResponseDto, foundUser);
  }

  async getMyProfile(userId: string): Promise<GetUserProfileResponseDto> {
    const foundUser = await this.userService.getUserById(userId);
    const foundWallet = await this.userWalletService.getWallet(userId);
    return plainToInstance(
      GetUserProfileResponseDto,
      {
        ...foundUser,
        wallet: foundWallet && {
          ...foundWallet,
          balance: await this.xrplWalletService.getBalance(foundWallet.address),
        },
      },
      {
        groups: [EXPOSED_GROUPS.ME],
      },
    );
  }

  async getMyLikedUserList(
    userId: string,
  ): Promise<GetUserProfileResponseDto[]> {
    const foundUsers = await this.userService.getLikedUsersByUserId(userId);
    return plainToInstance(GetUserProfileResponseDto, foundUsers);
  }

  async updateProfile(
    userId: string,
    updateProfileRequestBodyDto: UpdateProfileRequestBodyDto,
  ) {
    await this.prisma.$transaction(async (tx) => {
      const updateUserDto = plainToInstance(
        UpdateUserDto,
        updateProfileRequestBodyDto,
      );
      await this.userService.updateUser(userId, updateUserDto, tx);

      if (updateProfileRequestBodyDto.tags) {
        await this.userTagService.checkDuplicateUserTag(
          updateProfileRequestBodyDto.tags,
        );
        await this.userTagService.updateUserTag(
          userId,
          updateProfileRequestBodyDto.tags,
          tx,
        );
      }

      if (updateProfileRequestBodyDto.socials) {
        const upsertUserSocialDtoArr = plainToInstance(
          UpsertUserSocialDto,
          updateProfileRequestBodyDto.socials,
        );
        await this.userSocialService.checkDuplicateSocialType(
          upsertUserSocialDtoArr,
        );
        await this.userSocialService.upsertUserSocials(
          userId,
          upsertUserSocialDtoArr,
          tx,
        );
      } else if (updateProfileRequestBodyDto.socials === null) {
        await this.userSocialService.deleteByUserId(userId, tx);
      }

      if (updateProfileRequestBodyDto.location) {
        const updateUserLocationDto = plainToInstance(
          UpsertUserLocationDto,
          updateProfileRequestBodyDto.location,
        );
        await this.userLocationService.upsertUserLocation(
          userId,
          updateUserLocationDto,
          tx,
        );
      } else if (updateProfileRequestBodyDto.location === null) {
        await this.userLocationService.deleteByUserId(userId, tx);
      }
    });
  }
}
