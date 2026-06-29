// /src/lib/handlerFactory.ts
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { getPool } from "@/lib/db";
import { checkMethod, handleServerError } from "@/lib/apiHandler";
import { getTotalData } from "@/utils/pagination/getTotalData";
import { buildPaginationQuery } from "@/utils/pagination/buildPaginationQuery";
import { getPaginationParams } from "@/utils/pagination/getPaginationParams";
import type { ApiResponse } from "@/types/api";
import type { QueryParam } from "@/types/queryParams";

// ============================================================
// Shared Base Config
// ============================================================
interface BaseConfig<TFilters extends { branch: string }> {
  schema: z.ZodType<TFilters>;
  buildFilters: (filters: TFilters) => {
    conditions: string;
    params: QueryParam[];
  };
  buildQuery: (conditions: string, params: QueryParam[]) => string;
  errorContext: string;
}

// ============================================================
// 1. Handler DENGAN Pagination
// ============================================================
interface PaginatedConfig<
  TFilters extends { branch: string },
> extends BaseConfig<TFilters> {
  successMessage: string | ((branch: string) => string);
  emptyMessage: string | ((branch: string) => string);
  return404IfEmpty?: boolean;
}

export function createPaginatedGetHandler<TFilters extends { branch: string }>(
  config: PaginatedConfig<TFilters>,
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
    const branch = filters.branch;

    try {
      const pool = getPool(branch);
      const { page, limit, exportAll } = getPaginationParams(req);

      const { conditions, params } = config.buildFilters(filters);
      const baseQuery = config.buildQuery(conditions, params);

      const total = await getTotalData(pool, baseQuery, params);

      const { query, values } = buildPaginationQuery({
        baseQuery,
        params,
        page,
        limit,
        exportAll,
      });

      const { rows } = await pool.query(query, values);

      // Handle jika data kosong (404)
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

      // Handle successMessage yang bisa berupa string atau fungsi
      const successMsg =
        typeof config.successMessage === "function"
          ? config.successMessage(branch)
          : config.successMessage;

      return res.status(200).json({
        success: true,
        message: successMsg,
        total,
        page: exportAll ? 1 : page,
        limit: exportAll ? total : limit,
        totalPages: exportAll ? 1 : Math.ceil(total / limit),
        data: rows,
      });
    } catch (error) {
      return handleServerError(res, error, branch, config.errorContext);
    }
  };
}

// ============================================================
// 2. Handler TANPA Pagination (Simple / Ambil Semua Data)
// ============================================================
interface SimpleConfig<
  TFilters extends { branch: string },
> extends BaseConfig<TFilters> {
  successMessage: string | ((branch: string) => string);
  emptyMessage: string | ((branch: string) => string);
  return404IfEmpty?: boolean;
}

export function createSimpleGetHandler<TFilters extends { branch: string }>(
  config: SimpleConfig<TFilters>,
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
    const branch = filters.branch;

    try {
      const pool = getPool(branch);
      const { conditions, params } = config.buildFilters(filters);

      const query = config.buildQuery(conditions, params);
      const { rows } = await pool.query(query, params);

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
        total: rows.length,
        data: rows,
      });
    } catch (error) {
      return handleServerError(res, error, branch, config.errorContext);
    }
  };
}
