import { HttpException } from '@nestjs/common';

export class BaseException extends HttpException {
  constructor(errorCode: string, statusCode: number) {
    super(errorCode, statusCode);
    this.message = BaseException.name;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
  }

  message: string;

  /**
   * @example 'G00001'
   */
  errorCode: string;

  /**
   * @example 400
   */
  statusCode: number;
}
