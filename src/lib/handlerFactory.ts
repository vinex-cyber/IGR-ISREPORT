import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { getPool } from "@/lib/db";
import { checkMethod, handleServerError } from "@/lib/apiHandler";
import type { ApiResponse } from "@/types/api";
import type { QueryParam } from "@/types/queryParams";
import { getRequestBranch } from "@/utils/getRequestBranch";

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
// Handler TANPA Pagination (Simple / Ambil Semua Data)
// ============================================================
interface SimpleConfig<TFilters> extends BaseConfig<TFilters> {
  successMessage: string | ((branch: string) => string);
  emptyMessage: string | ((branch: string) => string);
  return404IfEmpty?: boolean;
}

export function createSimpleGetHandler<TFilters>(
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
    const branch = getRequestBranch(req);

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
