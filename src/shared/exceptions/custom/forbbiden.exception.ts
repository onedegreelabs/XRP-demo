import { BaseException } from '@exception/custom/base.exception';
import { HttpExceptionStatus } from '@exception/enum/http-status.enum';

export class ForbiddenException extends BaseException {
  constructor(errorCode: string) {
    super(errorCode, HttpExceptionStatus.FORBIDDEN);
  }
}
