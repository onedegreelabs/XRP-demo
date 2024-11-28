import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { GlobalExceptionEnum } from '@exception/enum/global.enum';
import { BadRequestException } from '@exception/custom/bad-request.exception';

/**
 * * form data json interceptor
 * * parse form data json to object
 * * all form data json should be parsed to object
 *
 * @author Jason
 */
@Injectable()
export class FormDataJsonInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const contentType = request.headers['content-type'] || '';

    // application/json 요청일 경우 직접 처리하지 않고 바로 다음 핸들러로 넘깁니다.
    if (contentType.includes('application/json')) {
      return next.handle();
    }

    try {
      request.body = JSON.parse(request.body.data);
    } catch (err) {
      throw new BadRequestException(
        GlobalExceptionEnum.MultipartDataIsNotInJsonFormat,
      );
    }

    return next.handle();
  }
}
