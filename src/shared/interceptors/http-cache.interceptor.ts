import { ExecutionContext, Injectable } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { validateCachingPath } from '@cache/constants/cache.constant';
/**
 * Http Cache Interceptor
 * Get 요청에 대해서만 캐시를 적용하고, noCache=true query parameter가 있는 경우 캐시를 적용하지 않는다.
 * 또한, 설정된 캐시 예외 path 목록에 포함된 경우 캐시를 적용하지 않는다.
 *
 * @author sean
 */
@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const { httpAdapter } = this.httpAdapterHost;
    const request = context.switchToHttp().getRequest();
    const method = httpAdapter.getRequestMethod(request);
    const requestPath = httpAdapter.getRequestUrl(request).split('?')[0];
    const { noCache } = request.query;

    if (method !== 'GET') {
      return undefined;
    }

    if (noCache && noCache.toLowerCase() === 'true') {
      return undefined;
    }

    if (!validateCachingPath(requestPath)) {
      return undefined;
    }

    return httpAdapter.getRequestUrl(request);
  }
}
