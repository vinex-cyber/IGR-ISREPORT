import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { getPool } from "@/lib/db";
import { checkMethod, handleServerError } from "@/lib/apiHandler";
import type { ApiResponse } from "@/types/api";
import type { QueryParam } from "@/types/queryParams";
import { getRequestBranch } from "@/utils/getRequestBranch";

function stripTrailingSemicolon(sql: string): string {
  return sql.replace(/;\s*$/, "");
}

// ============================================================
// Shared Base Config
// ============================================================
interface BaseConfig<TFilters> {
  schema: z.ZodType<TFilters, z.ZodTypeDef, unknown>;
  buildFilters: (filters: TFilters) => {
    conditions: string;
    params: QueryParam[];
  };
  buildQuery: (conditions: string, params: QueryParam[]) => string;
  errorContext: string;
}

// ============================================================
// Handler GET (Ambil Semua Data)
// ============================================================
interface GetHandlerConfig<TFilters> extends BaseConfig<TFilters> {
  successMessage: string | ((branch: string) => string);
  emptyMessage: string | ((branch: string) => string);
  return404IfEmpty?: boolean;
  paginated?: boolean;
}

function parsePageParams(
  req: NextApiRequest,
): { page: number; pageSize: number; offset: number } {
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 10));
  const offset = (page - 1) * pageSize;
  return { page, pageSize, offset };
}

export function createGetHandler<TFilters>(
  config: GetHandlerConfig<TFilters>,
) {
  return async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse<unknown>>,
  ) {
    if (!checkMethod(req, res, "GET")) return;

    const parsed = config.schema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Query parameter tidak valid.",
        errors: parsed.error.flatten(),
      });
    }

    const filters = parsed.data;
    const branch = getRequestBranch(req);

    try {
      const pool = getPool(branch);
      const { conditions, params } = config.buildFilters(filters);
      const paramCount = params.length;

      const query = stripTrailingSemicolon(config.buildQuery(conditions, params));

      let total: number;
      let rows: unknown[];

      if (config.paginated) {
        const { pageSize, offset } = parsePageParams(req);

        const countResult = await pool.query(
          `SELECT COUNT(*) AS cnt FROM (${query}) AS pagination_count`,
          params,
        );
        total = parseInt(countResult.rows[0]?.cnt as string, 10) || 0;

        const paramIdx = paramCount + 1;
        const paginatedQuery = `${query} LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`;
        const result = await pool.query(paginatedQuery, [...params, pageSize, offset]);
        rows = result.rows;
      } else {
        const result = await pool.query(query, params);
        rows = result.rows;
        total = rows.length;
      }

      if (config.return404IfEmpty !== false && rows.length === 0) {
        const msg =
          typeof config.emptyMessage === "function"
            ? config.emptyMessage(branch)
            : config.emptyMessage;

        return res.status(404).json({
          success: false,
          message: msg,
        });
      }

      const successMsg =
        typeof config.successMessage === "function"
          ? config.successMessage(branch)
          : config.successMessage;

      return res.status(200).json({
        success: true,
        message: successMsg,
        total,
        data: rows,
      });
    } catch (error) {
      return handleServerError(res, error, branch, config.errorContext);
    }
  };
}
