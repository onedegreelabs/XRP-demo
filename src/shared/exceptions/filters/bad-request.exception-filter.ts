import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { UncaughtExceptionEnum } from '@exception/enum/uncaught.enum';
import { BaseException } from '@exception/custom/base.exception';

/**
 * - class-validator에 의해 발생하는 BAD_REQUEST 예외를 처리하는 필터
 * - `BaseException` 형태로 매핑하여 반환합니다.
 *
 * @author Sean
 */
@Catch(BadRequestException)
export class BadRequestExceptionFilter
  implements ExceptionFilter<BadRequestException>
{
  private logger = new Logger(BadRequestExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const exceptionResponse = exception.getResponse();
    const statusCode = exception.getStatus();

    const res = {
      message: exceptionResponse.valueOf()['message'],
      errorCode: UncaughtExceptionEnum.BAD_REQUEST,
      statusCode,
    } as BaseException;

    this.logger.error(JSON.stringify(res));
    this.logger.error(exception.stack);
    response.status(statusCode).json(res);
  }
}
