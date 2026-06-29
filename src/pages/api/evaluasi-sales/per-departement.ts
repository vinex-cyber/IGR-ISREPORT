// /src/pages/api/evaluasi-sales/per-departement.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getPool } from "@/lib/db";
import { FilterDetailStruk } from "@/utils/filters/FiltersDetailStruk"; // pastikan import benar
import { FilterDetailStrukSchema } from "@/schema/filterDetailStruk"; // pastikan import benar
import { DetailStruk } from "@/utils/query/detailStruk";
import { checkMethod, handleServerError } from "@/lib/apiHandler";
import { ApiResponse } from "@/types/api";
import type { QueryParam } from "@/types/queryParams";

// ============================================================
// Query Builder
// ============================================================
const buildQuery = (conditions: string, params: QueryParam[]) => `
          SELECT
            dtl_k_div as div,
            dtl_k_dept as dept,
            dtl_nama_dept as nama_dept,
            count(distinct dtl_cusno) as jumlah_member,
            count(distinct dtl_struk) as jumlah_struk,
            count(distinct dtl_prdcd_ctn) as jumlah_produk,
            sum(dtl_qty_pcs) as total_qty,
            sum(dtl_gross) as total_gross,
            sum(dtl_netto) as total_netto,
            sum(dtl_margin) as total_margin
        FROM
            (${DetailStruk(conditions, params)}) as dtl
        GROUP BY dtl_k_div, dtl_k_dept, dtl_nama_dept
        having coalesce(SUM(dtl_netto),0) <> 0
        ORDER BY dtl_k_div, dtl_k_dept
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
        message: `Tidak ada data evaluasi sales per departement untuk branch '${branch}'.`,
      });
    }

    // 5. Sukses
    return res.status(200).json({
      success: true,
      message: `Data evaluasi sales per departement untuk branch '${branch}' berhasil diambil.`,
      total: rows.length,
      data: rows,
    });
  } catch (error) {
    return handleServerError(
      res,
      error,
      branch,
      "Evaluasi Sales Per Departement",
    );
  }
}
