// /src/pages/api/evaluasi-sales/per-struk.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getPool } from "@/lib/db";
import { FilterDetailStruk } from "@/utils/filters/FiltersDetailStruk"; // pastikan import benar
import { FilterDetailStrukSchema } from "@/schema/filterDetailStruk"; // pastikan import benar
import { DetailStruk } from "@/utils/query/detailStruk";
import { QueryParam } from "@/types/queryParams";
import { checkMethod, handleServerError } from "@/lib/apiHandler";
import { buildPaginationQuery } from "@/utils/pagination/buildPaginationQuery";
import { getTotalData } from "@/utils/pagination/getTotalData";
import { getPaginationParams } from "@/utils/pagination/getPaginationParams";
import { ApiResponse } from "@/types/api";

const buildQuery = (conditions: string, params: QueryParam[]) => `
SELECT
            to_char(dtl_tanggal, 'dd-MM-yyyy') as tanggal,
            dtl_struk as struk,
            dtl_stat as station,
            dtl_kasir as kasir,
            dtl_cusno as kd_member,
            dtl_namamember as nama_member,
            count(distinct dtl_prdcd_ctn) as jumlah_produk,
            sum(dtl_qty_pcs) as total_qty,
            sum(dtl_gross) as total_gross,
            sum(dtl_netto) as total_netto,
            sum(dtl_margin) as total_margin,
            dtl_method as metode_pembayaran,
            case
                  when dtl_outlet = '0' then 'KARYAWAN'
                  when dtl_outlet = '6' then 'BIRU'
                  when dtl_outlet = '6' and dtl_suboutlet = '6' and dtl_cusno = 'KLE84Y' then 'FREE PASS'
                  when dtl_outlet <> '6' or dtl_outlet <> '0' and coalesce(dtl_memberkhusus,'N') = 'Y' then 'MERAH'
                  else 'OTHER'
            end as jenis_member
        FROM
            (${DetailStruk(conditions, params)}) as dtl
        GROUP BY 
            to_char(dtl_tanggal, 'dd-MM-yyyy'),
            to_char(dtl_tanggal, 'yyyymmdd'),
            dtl_struk,
            dtl_stat,
            dtl_kasir,
            dtl_method,
            dtl_outlet,
            dtl_suboutlet,
            dtl_cusno,
            dtl_namamember,
            dtl_memberkhusus
        HAVING count(dtl_netto) > 0
        ORDER BY to_char(dtl_tanggal, 'yyyymmdd'), dtl_struk, dtl_stat, dtl_kasir

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

    const { page, limit, exportAll } = getPaginationParams(req);

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
      message: "Data evaluasi sales per struk berhasil diambil.",
      total,
      page: exportAll ? 1 : page,
      limit: exportAll ? total : limit,
      totalPages: exportAll ? 1 : Math.ceil(total / limit),
      data: rows,
    });
  } catch (error) {
    return handleServerError(res, error, branch, "Evaluasi Sales Per Struk");
  }
}
