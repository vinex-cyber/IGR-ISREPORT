// utils/pagination/getTotalData.ts

import type { Pool } from "pg";
import type { QueryParam } from "@/types/queryParams";

export async function getTotalData(
  pool: Pool,
  baseQuery: string,
  params: QueryParam[],
) {
  const result = await pool.query(
    `
    SELECT COUNT(*)::int total
    FROM (
      ${baseQuery}
    ) t
`,
    params,
  );

  return result.rows[0].total as number;
}
