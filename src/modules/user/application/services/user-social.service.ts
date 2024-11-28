import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserSocialRepository } from '@user/domain/repositories/user-social.repository';
import { UpsertUserSocialDto } from '@user/application/dtos/upsert-user-social.dto';
import { BadRequestException } from '@exception/custom/bad-request.exception';
import { UserExceptionEnum } from '@exception/enum/user.enum';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserSocialService {
  constructor(private readonly userSocialRepository: UserSocialRepository) {}

  async upsertUserSocials(
    userId: string,
    upsertUserSocialDtoArr: UpsertUserSocialDto[],
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    await this.userSocialRepository.deleteByUserId(userId, tx);
    await Promise.all(
      upsertUserSocialDtoArr.map(async (upsertUserSocialDto, position) => {
        await this.userSocialRepository.save(
          userId,
          plainToInstance(UpsertUserSocialDto, {
            ...upsertUserSocialDto,
            position,
          }),
          tx,
        );
      }),
    );
  }

  async deleteByUserId(
    userId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    await this.userSocialRepository.deleteByUserId(userId, tx);
  }

  async checkDuplicateSocialType(
    upsertUserSocialDtoArr: UpsertUserSocialDto[],
  ): Promise<void> {
    const socialTypes = upsertUserSocialDtoArr.map(
      (upsertUserSocialDto) => upsertUserSocialDto.type,
    );
    if (new Set(socialTypes).size !== socialTypes.length) {
      throw new BadRequestException(UserExceptionEnum.AlreadyUsedSocialType);
    }
  }
}
