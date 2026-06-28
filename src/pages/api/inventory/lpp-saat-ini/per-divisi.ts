// /src/pages/api/inventory/lpp-saat-ini/per-divisi.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getPool } from "@/lib/db";
import { ApiResponse } from "@/types/api";
import { checkMethod, handleServerError } from "@/lib/apiHandler";
import { FilterLppSaatIniSchema } from "@/schema/filterLppSaatIni";
import { buildFilterLppSaatIni } from "@/utils/filters/FilterLppSaatIni";
import { QueryLppSaatIni } from "@/utils/query/queryLppSaatIni";

// ============================================================
// Query Builder
// ============================================================
const buildQuery = (conditions: string) => `
  SELECT
    st_div,
    st_div_nama,
    COUNT(st_prdcd)                AS st_item_produk,
    SUM(st_saldo_in_pcs)           AS st_saldo_in_pcs,
    SUM(st_saldo_rph)              AS st_saldo_rph,
    SUM(st_saldo_rph_lastcost)     AS st_saldo_rph_lastcost,
    COUNT(DISTINCT st_supp_kode)   AS st_supp_jumlah
  FROM (${QueryLppSaatIni({ conditions })}) as lpp
  GROUP BY st_div, st_div_nama
  HAVING COALESCE(SUM(st_saldo_in_pcs), 0) <> 0
  ORDER BY st_div
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

    // 3. Build filter & query
    const { conditions, params } = buildFilterLppSaatIni(filters);
    const { rows } = await pool.query(buildQuery(conditions), params);
    // 4. Response Tidak ada data
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Tidak ada data LPP per divisi untuk branch '${branch}'.`,
      });
    }
    // 5. Response Success
    return res.status(200).json({
      success: true,
      message: `Data LPP per divisi branch '${branch}' berhasil diambil.`,
      total: rows.length,
      data: rows,
    });
  } catch (error) {
    return handleServerError(res, error, branch, "LPP Per Divisi");
  }
}
