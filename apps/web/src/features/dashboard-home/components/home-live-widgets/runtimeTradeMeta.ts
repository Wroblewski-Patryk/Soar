import type { RuntimeTradeMeta } from "./types";

export const buildRuntimeTradeMeta = (params: {
  page: number;
  pageSize: number;
  total: number;
}): RuntimeTradeMeta => {
  const pageSize = Math.max(1, params.pageSize);
  const total = Math.max(0, params.total);
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);
  const page = totalPages === 0 ? 1 : Math.min(Math.max(1, params.page), totalPages);

  return {
    page,
    pageSize,
    total,
    totalPages,
    hasPrev: totalPages > 0 && page > 1,
    hasNext: totalPages > 0 && page < totalPages,
  };
};
