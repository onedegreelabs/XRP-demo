import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateAuthDto } from '@user/application/dtos/create-auth.dto';
import { GetAuthDto } from '@user/application/dtos/get-auth.dto';
import { Prisma } from '@prisma/client';
import { AuthRepository } from '@user/domain/repositories/auth.repository';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async createAuth(
    userId: string,
    email: string,
    tx?: Prisma.TransactionClient,
  ): Promise<GetAuthDto> {
    const createAuthDto = plainToInstance(CreateAuthDto, { email });
    const cretaedAuth = await this.authRepository.save(
      userId,
      createAuthDto,
      tx,
    );
    return plainToInstance(GetAuthDto, cretaedAuth);
  }
}
