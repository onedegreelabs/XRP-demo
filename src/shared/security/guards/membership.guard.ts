import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthExceptionEnum } from '@exception/enum/auth.enum';
import { ForbiddenException } from '@exception/custom/forbbiden.exception';
import { UserAccessLevel } from '@prisma/client';
import { PrismaService } from '@persistence/prisma/prisma.service';
import { AuthTokenPayloadDto } from '@user/interface/dtos/common/auth-token-payload.dto';

@Injectable()
export class MembershipGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler(); // 메서드
    const controller = context.getClass(); // 클래스

    // 메서드와 클래스의 메타데이터를 각각 확인
    const requiredAccessLevels =
      this.reflector.get<UserAccessLevel[]>('userAccessLevels', handler) ||
      this.reflector.get<UserAccessLevel[]>('userAccessLevels', controller);

    if (!requiredAccessLevels || requiredAccessLevels.length === 0) {
      return true; // No access levels set, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user: AuthTokenPayloadDto = request.user;

    const foundUser = await this.prisma.user.findUnique({
      where: { id: user.userId },
    });

    if (!user || !requiredAccessLevels.includes(foundUser.accessLevel)) {
      throw new ForbiddenException(AuthExceptionEnum.UnauthorizedAccess);
    }

    return true;
  }
}
