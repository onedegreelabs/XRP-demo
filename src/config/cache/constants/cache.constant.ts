/**
 * 캐싱을 하지 않을 경로를 정규표현식으로 정의 (캐싱을 하지 않을 경로가 추가될 때마다 추가)
 *
 * @author Sean
 * @example
 * ```ts
 * '/v1/examples' => /(\/v1\/examples)(.*)/i
 * ```
 */
const EXCLUDE_PATHS_REGEX: RegExp[] = [/(\/)(.*)/i] as const;

/**
 * CacheInterceptor에서 캐싱을 하지 않을 경로인지 확인하는 함수
 *
 * @author Sean
 * @param url - request url
 * @returns boolean
 * @example
 * ```ts
 * if(validateCachingPath(req.url)) {
 *  // do something
 * }
 * ```
 */
export function validateCachingPath(url: string): boolean {
  return !EXCLUDE_PATHS_REGEX.some((path) => path.test(url));
}
