import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from '@user/application/dtos/create-user.dto';
import { GetUserDto } from '@user/application/dtos/get-user.dto';
import { UserRepository } from '@user/domain/repositories/user.repository';
import { UpdateUserDto } from '@user/application/dtos/update-user.dto';
import { generateRandomString } from '@util/index';
import { ConflictException } from '@exception/custom/conflict.exception';
import { UserExceptionEnum } from '@exception/enum/user.enum';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(
    createUserDto: CreateUserDto,
    tx?: Prisma.TransactionClient,
  ): Promise<GetUserDto> {
    const createdUser = await this.userRepository.save(createUserDto, tx);
    return plainToInstance(GetUserDto, createdUser);
  }

  async getUserById(userId: string): Promise<GetUserDto> {
    const user = await this.userRepository.findById(userId);
    return plainToInstance(GetUserDto, user);
  }

  async getUserByHandle(handle: string): Promise<GetUserDto> {
    const user = await this.userRepository.findByHandle(handle);
    return plainToInstance(GetUserDto, user);
  }

  async getUserByEmail(email: string): Promise<GetUserDto> {
    const user = await this.userRepository.findByEmail(email);
    return plainToInstance(GetUserDto, user);
  }

  async getLikedUsersByUserId(userId: string): Promise<GetUserDto[]> {
    const user = await this.userRepository.findLikedUsersByUserId(userId);
    return plainToInstance(GetUserDto, user);
  }

  async updateUser(
    userId: string, // userId는 Guard에서 이미 검증됨.
    updateUserDto: UpdateUserDto,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    await this.userRepository.update(userId, updateUserDto, tx);
  }

  async updateHandle(userId: string, handle: string): Promise<void> {
    await this.checkDuplicateHandle(handle);
    const updateUserDto = plainToInstance(UpdateUserDto, { handle });
    await this.userRepository.update(userId, updateUserDto);
  }

  async checkDuplicateHandle(handle: string): Promise<void> {
    const foundUser = await this.userRepository.findByHandle(handle);
    if (foundUser) {
      throw new ConflictException(UserExceptionEnum.AlreadyUsedHandle);
    }
  }

  async checkDuplicateEmail(email: string): Promise<void> {
    const foundUser = await this.userRepository.findByEmail(email);
    if (foundUser) {
      throw new ConflictException(UserExceptionEnum.AlreadyUsedEmail);
    }
  }

  async getRandomHandle(name: string): Promise<string> {
    const formattedName = name.trim().replace(/\s+/g, '-');
    let randomStringLength = 6;
    const retryLimit = 5;

    while (true) {
      for (let i = 0; i < retryLimit; i++) {
        const randomString = generateRandomString(
          'abcdefghjklmnpqrstuvwxyz23456789',
          randomStringLength,
        );
        const handle = `${formattedName}-${randomString}`;
        const foundUser = await this.userRepository.findByHandle(handle);
        if (!foundUser) {
          return handle;
        }
      }
      // retryLimit 횟수 내에 고유 핸들을 찾지 못하면 길이를 1 증가
      randomStringLength++;
    }
  }
}
