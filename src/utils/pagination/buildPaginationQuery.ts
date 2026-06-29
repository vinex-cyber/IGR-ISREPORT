// utils/pagination/buildPaginationQuery.ts

import type { QueryParam } from "@/types/queryParams";

interface PaginationOptions {
  baseQuery: string;
  params: QueryParam[];
  page: number;
  limit: number;
  exportAll?: boolean;
}

export function buildPaginationQuery({
  baseQuery,
  params,
  page,
  limit,
  exportAll = false,
}: PaginationOptions) {
  const values = [...params];

  let query = `
    SELECT *
    FROM (
      ${baseQuery}
    ) t
  `;

  if (!exportAll) {
    query += `
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
    `;

    values.push(limit);
    values.push((page - 1) * limit);
  }

  return {
    query,
    values,
  };
}
