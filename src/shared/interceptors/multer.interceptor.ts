import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import * as multer from 'multer';
import { Observable } from 'rxjs';
import { RequestHandler } from 'express';
import { sum } from 'lodash';
import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { IMulterOptions } from '@config/multer/multer.type';
import { MulterBuilder } from '@config/multer/multer.builder';

export function MulterInterceptor(
  fields: MulterField[],
  opts: IMulterOptions,
): NestInterceptor {
  return {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const req = context.switchToHttp().getRequest();

      const upload: RequestHandler = multer(
        new MulterBuilder()
          .setStorage(opts.saveDir)
          .setLimits({
            fileSize: opts.fileSize,
            files: sum(fields.map((field) => field.maxCount)),
          })
          .setFileFilter(opts.allowedMimeTypes)
          .build(),
      ).fields(fields);

      return new Observable((observer) => {
        upload(req, null, async (err: any) => {
          if (err) {
            observer.error(err);
          } else {
            const subscription = next.handle().subscribe({
              next: (data) => observer.next(data),
              error: (error) => observer.error(error),
              complete: () => {
                observer.complete();
                subscription.unsubscribe(); // observer 구독해제: 메모리 누수 방지
              },
            });
          }
        });
      });
    },
  };
}
