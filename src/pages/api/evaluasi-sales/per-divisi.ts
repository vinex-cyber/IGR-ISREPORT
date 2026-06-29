// /src/pages/api/evaluasi-sales/per-divisi.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getPool } from "@/lib/db";
import { ApiResponse } from "@/types/api";
import { checkMethod, handleServerError } from "@/lib/apiHandler";
import { FilterDetailStrukSchema } from "@/schema/filterDetailStruk";
import { FilterDetailStruk } from "@/utils/filters/FiltersDetailStruk";
import { DetailStruk } from "@/utils/query/detailStruk";
import type { QueryParam } from "@/types/queryParams";

// ============================================================
// Query Builder
// ============================================================
const buildQuery = (conditions: string, params: QueryParam[]) => `
  SELECT
    dtl_k_div                        AS div,
    dtl_nama_div                     AS nama_div,
    COUNT(DISTINCT dtl_cusno)        AS jumlah_member,
    COUNT(DISTINCT dtl_struk)        AS jumlah_struk,
    COUNT(DISTINCT dtl_prdcd_ctn)    AS jumlah_produk,
    SUM(dtl_qty_pcs)                 AS total_qty,
    SUM(dtl_gross)                   AS total_gross,
    SUM(dtl_netto)                   AS total_netto,
    SUM(dtl_margin)                  AS total_margin
  FROM (${DetailStruk(conditions, params)}) AS dtl
  GROUP BY dtl_k_div, dtl_nama_div
  HAVING COALESCE(SUM(dtl_netto), 0) <> 0
  ORDER BY dtl_k_div
`;

// ============================================================
// Handler
// ============================================================
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<unknown>>,
) {
  if (!checkMethod(req, res, "GET")) return;

  // 1. Validasi query parameter
  const parsed = FilterDetailStrukSchema.safeParse(req.query);
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
    const { conditions, params } = FilterDetailStruk(filters);
    const { rows } = await pool.query(buildQuery(conditions, params), params);

    // 4. Tidak ada data
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Tidak ada data evaluasi sales per divisi untuk branch '${branch}'.`,
      });
    }

    // 5. Sukses
    return res.status(200).json({
      success: true,
      message: `Data evaluasi sales per divisi branch '${branch}' berhasil diambil.`,
      total: rows.length,
      data: rows,
    });
  } catch (error) {
    return handleServerError(res, error, branch, "Evaluasi Sales Per Divisi");
  }
}
