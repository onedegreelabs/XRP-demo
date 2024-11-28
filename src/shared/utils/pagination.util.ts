import {
  CursorPaginationOption,
  OffsetPaginationOption,
  PrismaPaginationParam,
} from '@shared/types/pagination.type';

// * Prisma Pagination을 위한 파라미터를 생성하는 함수
export function buildPrismaPaginationParam(
  option: OffsetPaginationOption | CursorPaginationOption,
): PrismaPaginationParam {
  let cursor: { id: string } | null;
  let skip: number;
  const take = option.take;
  const cursorId = (option as CursorPaginationOption).cursorId;
  const page = (option as OffsetPaginationOption).page;

  if (page) {
    skip = (page - 1) * take;
  } else if (cursorId) {
    cursor = cursorId ? { id: cursorId } : undefined;
    skip = cursor ? 1 : 0;
  }

  return { cursor, skip, take };
}
