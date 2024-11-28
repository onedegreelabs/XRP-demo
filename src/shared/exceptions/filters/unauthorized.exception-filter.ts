import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UncaughtExceptionEnum } from '@exception/enum/uncaught.enum';
import { BaseException } from '@exception/custom/base.exception';

/**
 * - Guards 단계에서 발생하는 UNAUTHORIZED 예외를 처리하는 필터
 * - 예외처리를 못했을 때 NestJS에 내장된 Exception이 발생하며, 이 필터가 실행됩니다.
 * - `BaseException` 형태로 매핑하여 반환합니다.
 *
 * @author Sean
 */
@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter
  implements ExceptionFilter<HttpException>
{
  private logger = new Logger(UnauthorizedExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const exceptionResponse = exception.getResponse();
    const statusCode = exception.getStatus();

    const res = {
      message: exceptionResponse.valueOf()['message'],
      errorCode: UncaughtExceptionEnum.UNAUTHORIZED,
      statusCode,
    } as BaseException;

    this.logger.error(JSON.stringify(res));
    this.logger.error(exception.stack);
    response.status(statusCode).json(res);
  }
}
