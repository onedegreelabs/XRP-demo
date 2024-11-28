import { ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { BaseExceptionFilter } from '@exception/filters/base.exception-filter';
import { BadRequestExceptionFilter } from '@exception/filters/bad-request.exception-filter';
import { UnauthorizedExceptionFilter } from '@exception/filters/unauthorized.exception-filter';
import { ForbiddenExceptionFilter } from '@exception/filters/forbidden.exception-filter';
import { NotFoundExceptionFilter } from '@exception/filters/not-found.exception-filter';
import { InternalServerErrorExceptionFilter } from '@exception/filters/internal-server-error.exception-filter';
import { PrismaClientExceptionFilter } from '@exception/filters/prisma-client.exception-filter';
import { MulterExceptionFilter } from '@exception/filters/multer.exception-filter';
import { ResponseFormatInterceptor } from '@interceptor/response-format.interceptor';

export function globalsSetup(app: NestExpressApplication) {
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    app.get<ResponseFormatInterceptor>(ResponseFormatInterceptor),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(
    new BaseExceptionFilter(),
    new BadRequestExceptionFilter(),
    new UnauthorizedExceptionFilter(),
    new ForbiddenExceptionFilter(),
    new NotFoundExceptionFilter(),
    new InternalServerErrorExceptionFilter(),
    new PrismaClientExceptionFilter(),
    new MulterExceptionFilter(),
  );
}
