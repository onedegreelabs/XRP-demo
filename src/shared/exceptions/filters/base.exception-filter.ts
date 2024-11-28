import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { BaseException } from '@exception/custom/base.exception';

/**
 * - 비즈니스로직에서 발생하는 모든 예외가 통과하는 필터
 *
 * @author Sean
 */
@Catch(BaseException)
export class BaseExceptionFilter implements ExceptionFilter<BaseException> {
  private logger = new Logger(BaseExceptionFilter.name);

  catch(exception: BaseException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = exception.statusCode;

    const res = {
      message: exception.message,
      errorCode: exception.errorCode,
      statusCode,
    } as BaseException;

    this.logger.error(JSON.stringify(res));
    this.logger.error(exception.stack);
    response.status(statusCode).json(res);
  }
}
