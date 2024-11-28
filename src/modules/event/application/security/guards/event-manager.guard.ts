import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthExceptionEnum } from '@exception/enum/auth.enum';
import { ForbiddenException } from '@exception/custom/forbbiden.exception';
import { EventHostAccessLevel } from '@prisma/client';
import { PrismaService } from '@persistence/prisma/prisma.service';
import { AuthTokenPayloadDto } from '@user/interface/dtos/common/auth-token-payload.dto';
import { EventExceptionEnum } from '@exception/enum/event.enum';

@Injectable()
export class EventManagerGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler(); // 메서드
    const controller = context.getClass(); // 클래스

    // 메서드와 클래스의 메타데이터를 각각 확인
    const requiredAccessLevels =
      this.reflector.get<EventHostAccessLevel[]>(
        'eventHostAccessLevels',
        handler,
      ) ||
      this.reflector.get<EventHostAccessLevel[]>(
        'eventHostAccessLevels',
        controller,
      );

    if (!requiredAccessLevels || requiredAccessLevels.length === 0) return true; // No roles set, allow access

    const request = context.switchToHttp().getRequest();
    const user: AuthTokenPayloadDto = request.user;
    const eventId = request.params.eventId;
    const foundEvent = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!foundEvent) {
      throw new ForbiddenException(EventExceptionEnum.EventNotFound);
    }

    const foundEventHost = await this.prisma.eventHost.findFirst({
      where: { eventId: foundEvent.id, userId: user.userId },
    });

    if (
      !foundEventHost ||
      !requiredAccessLevels.includes(foundEventHost.accessLevel)
    ) {
      throw new ForbiddenException(AuthExceptionEnum.UnauthorizedAccess);
    }

    return true;
  }
}
