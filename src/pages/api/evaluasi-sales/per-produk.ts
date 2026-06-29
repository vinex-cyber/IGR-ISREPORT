// /src/pages/api/evaluasi-sales/per-produk.ts

import { NextApiRequest, NextApiResponse } from "next";

import { getPool } from "@/lib/db";
import { checkMethod, handleServerError } from "@/lib/apiHandler";

import { FilterDetailStrukSchema } from "@/schema/filterDetailStruk";

import { FilterDetailStruk } from "@/utils/filters/FiltersDetailStruk";
import { DetailStruk } from "@/utils/query/detailStruk";

import { getTotalData } from "@/utils/pagination/getTotalData";
import { buildPaginationQuery } from "@/utils/pagination/buildPaginationQuery";

import type { ApiResponse } from "@/types/api";
import type { QueryParam } from "@/types/queryParams";

// ============================================================
// Query Builder
// ============================================================

const buildQuery = (conditions: string, params: QueryParam[]) => `
    SELECT
        dtl_k_div               AS div,
        dtl_k_dept              AS dept,
        dtl_k_katb              AS kategori,
        dtl_prdcd_ctn           AS plu,
        dtl_nama_barang         AS nama_produk,
        COUNT(DISTINCT dtl_cusno)   AS jumlah_member,
        COUNT(DISTINCT dtl_struk)   AS jumlah_struk,
        SUM(dtl_qty_pcs)            AS total_qty,
        SUM(dtl_gross)              AS total_gross,
        SUM(dtl_netto)              AS total_netto,
        SUM(dtl_margin)             AS total_margin
    FROM
        (${DetailStruk(conditions, params)}) AS dtl
    GROUP BY
        dtl_k_div,
        dtl_k_dept,
        dtl_k_katb,
        dtl_prdcd_ctn,
        dtl_nama_barang
    HAVING COUNT(dtl_netto) > 0
    ORDER BY total_margin DESC
`;

// ============================================================
// Handler
// ============================================================

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<unknown>>,
) {
  if (!checkMethod(req, res, "GET")) return;

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
    const pool = getPool(branch);

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 100);
    const exportAll = req.query.export === "true";

    const { conditions, params } = FilterDetailStruk(filters);

    const baseQuery = buildQuery(conditions, params);

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
    return handleServerError(res, error, branch, "Evaluasi Sales Per Produk");
  }
}
