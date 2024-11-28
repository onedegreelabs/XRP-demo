import { Injectable } from '@nestjs/common';
import { LikeRepository } from '@user/domain/repositories/like.repository';
import { NotFoundException } from '@exception/custom/not-found.exception';
import { UserExceptionEnum } from '@exception/enum/user.enum';
import { ConflictException } from '@exception/custom/conflict.exception';
import { UserRepository } from '@user/domain/repositories/user.repository';
import { BadRequestException } from '@exception/custom/bad-request.exception';

@Injectable()
export class LikeService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly likeRepository: LikeRepository,
  ) {}

  async like(userId: string, targetUserId: string): Promise<void> {
    if (userId === targetUserId) {
      throw new BadRequestException(UserExceptionEnum.CannotLikeSelf);
    }
    const foundUser = await this.userRepository.findById(targetUserId);
    if (!foundUser) {
      throw new NotFoundException(UserExceptionEnum.LikeTargetUserNotFound);
    }
    const foundLike = await this.likeRepository.findByUserIdAndTargetUserId(
      userId,
      targetUserId,
    );
    if (foundLike) {
      throw new ConflictException(UserExceptionEnum.LikeAlreadyExist);
    }
    await this.likeRepository.save(userId, targetUserId);
  }

  async unlike(userId: string, targetUserId: string): Promise<void> {
    if (userId === targetUserId) {
      throw new BadRequestException(UserExceptionEnum.CannotUnlikeSelf);
    }
    const foundUser = await this.userRepository.findById(targetUserId);
    if (!foundUser) {
      throw new NotFoundException(UserExceptionEnum.LikeTargetUserNotFound);
    }
    const foundLike = await this.likeRepository.findByUserIdAndTargetUserId(
      userId,
      targetUserId,
    );
    if (!foundLike) {
      throw new NotFoundException(UserExceptionEnum.LikeNotFound);
    }
    await this.likeRepository.delete(userId, targetUserId);
  }
}
