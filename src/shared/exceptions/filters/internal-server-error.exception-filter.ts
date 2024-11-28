import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UncaughtExceptionEnum } from '@exception/enum/uncaught.enum';
import { BaseException } from '@exception/custom/base.exception';

/**
 * - Internal-server-error 예외를 처리하는 필터
 * - 예외처리를 못했을 때 NestJS에 내장된 Exception이 발생하며, 이 필터가 실행됩니다.
 * - `BaseException` 형태로 매핑하여 반환합니다.
 *
 * @author Sean
 */
@Catch(InternalServerErrorException)
export class InternalServerErrorExceptionFilter
  implements ExceptionFilter<HttpException>
{
  private logger = new Logger(InternalServerErrorExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const exceptionResponse = exception.getResponse();
    const statusCode = exception.getStatus();

    const res = {
      message: exceptionResponse.valueOf()['message'],
      errorCode: UncaughtExceptionEnum.INTERNAL_SERVER_ERROR,
      statusCode,
    } as BaseException;

    this.logger.error(JSON.stringify(res));
    this.logger.error(exception.stack);
    response.status(statusCode).json(res);
  }
}
