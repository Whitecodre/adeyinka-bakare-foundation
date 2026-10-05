import { PAGINATION } from "../constants/site";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function calculatePagination(
  page: number = PAGINATION.DEFAULT_PAGE,
  limit: number = PAGINATION.DEFAULT_LIMIT,
  total: number = 0
): PaginationMeta {
  const validPage = Math.max(1, page);
  const validLimit = Math.min(
    Math.max(1, limit),
    PAGINATION.MAX_LIMIT
  );
  const totalPages = Math.ceil(total / validLimit);

  return {
    page: validPage,
    limit: validLimit,
    total,
    totalPages,
  };
}

export function getOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}
