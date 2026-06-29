// utils/pagination/getPaginationParams.ts

import type { NextApiRequest } from "next";

interface PaginationParams {
  page: number;
  limit: number;
  exportAll: boolean;
}

export function getPaginationParams(req: NextApiRequest): PaginationParams {
  return {
    page: Math.max(1, Number(req.query.page ?? 1)),
    limit: Math.min(500, Math.max(1, Number(req.query.limit ?? 100))),
    exportAll: req.query.export === "true",
  };
}
