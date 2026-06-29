// /src/pages/api/inventory/lpp-saat-ini/per-produk.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getPool } from "@/lib/db";
import { ApiResponse } from "@/types/api";
import { checkMethod, handleServerError } from "@/lib/apiHandler";
import { FilterLppSaatIniSchema } from "@/schema/filterLppSaatIni";
import { buildFilterLppSaatIni } from "@/utils/filters/FilterLppSaatIni";
import { QueryLppSaatIni } from "@/utils/query/queryLppSaatIni";
import { getTotalData } from "@/utils/pagination/getTotalData";
import { buildPaginationQuery } from "@/utils/pagination/buildPaginationQuery";
import { getPaginationParams } from "@/utils/pagination/getPaginationParams";

// ============================================================
// Query Builder
// ============================================================
const buildQuery = (conditions: string) => `
  SELECT
    *
  FROM (${QueryLppSaatIni({ conditions })}) as lpp
  where st_prdcd is not null
  ORDER BY st_div,st_dept,st_katb,st_prdcd
`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<unknown>>,
) {
  if (!checkMethod(req, res, "GET")) return;
  // 1. Validasi query parameter
  const parsed = FilterLppSaatIniSchema.safeParse(req.query);
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
    // 2. Koneksi ke database
    const pool = getPool(branch);

    const { page, limit, exportAll } = getPaginationParams(req);

    // 3. Build filter & query
    const { conditions, params } = buildFilterLppSaatIni(filters);

    const baseQuery = buildQuery(conditions);

    // total data
    const total = await getTotalData(pool, baseQuery, params);

    // query pagination / export
    const { query, values } = buildPaginationQuery({
      baseQuery,
      params,
      page,
      limit,
      exportAll,
    });

    const { rows } = await pool.query(query, values);

    // 4. Response Tidak ada data
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Tidak ada data LPP per Produk untuk branch '${branch}'.`,
      });
    }
    // 5. Response Success
    return res.status(200).json({
      success: true,
      message: "Data evaluasi sales per produk berhasil diambil.",
      total,
      page: exportAll ? 1 : page,
      limit: exportAll ? total : limit,
      totalPages: exportAll ? 1 : Math.ceil(total / limit),
      data: rows,
    });
  } catch (error) {
    return handleServerError(res, error, branch, "LPP Per Produk");
  }
}
