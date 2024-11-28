// * Pagination reponse type
export type CursorPaginated<T, K extends string = 'items'> = {
  [key in K]: T[];
} & {
  totalItems: number;
  take: number;
  cursorId: string;
  hasMore: boolean;
};

export type OffsetPaginated<T, K extends string = 'items'> = {
  [key in K]: T[];
} & {
  totalItems: number;
  totalPages: number;
  page: number;
  take: number;
  hasMore: boolean;
};

export type OffsetPaginationOption = {
  take: number;
  page: number;
};

export type CursorPaginationOption = {
  take: number;
  cursorId?: string;
};

export type PrismaPaginationParam = {
  cursor: { id: string } | null;
  skip: number | null;
  take: number | null;
};
