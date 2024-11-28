import { BaseException } from '@exception/custom/base.exception';
import { HttpExceptionStatus } from '@exception/enum/http-status.enum';

export class BadRequestException extends BaseException {
  constructor(errorCode: string) {
    super(errorCode, HttpExceptionStatus.BAD_REQUEST);
  }
}
