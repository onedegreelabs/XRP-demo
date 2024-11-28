import { MulterError } from 'multer';
import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { HttpExceptionStatus } from '@exception/enum/http-status.enum';
import { GlobalExceptionEnum } from '@exception/enum/global.enum';

/**
 * - Multer 예외를 처리하는 필터
 * - `BaseException` 형태로 매핑하여 반환합니다.
 *
 * @author Sean
 */
@Catch(MulterError)
export class MulterExceptionFilter implements ExceptionFilter<MulterError> {
  private logger = new Logger(MulterExceptionFilter.name);
  catch(exception: MulterError, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = HttpExceptionStatus.BAD_REQUEST;

    const res = {
      message: exception.code,
      errorCode: GlobalExceptionEnum.MulterRequestError,
      statusCode,
    };

    this.logger.error(JSON.stringify(res));
    this.logger.error(exception.stack);
    response.status(statusCode).json(res);
  }
}
