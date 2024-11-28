import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const File = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const files = request.files;
    return data
      ? files?.[data]
        ? files[data][0]
        : Object.create(null)
      : files;
  },
);
