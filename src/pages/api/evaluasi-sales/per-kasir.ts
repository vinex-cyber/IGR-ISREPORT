import { NextApiRequest, NextApiResponse } from "next";
import { getPool } from "@/lib/db";
import { FilterDetailStruk } from "@/utils/filters/FiltersDetailStruk"; // pastikan import benar
import { FilterDetailStrukSchema } from "@/schema/filterDetailStruk"; // pastikan import benar
import { DetailStruk } from "@/utils/query/detailStruk";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    // Ambil semua query string dan validasi pakai Zod
    const result = FilterDetailStrukSchema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors: result.error.flatten(),
      });
    }

    const filters = result.data;
    // branch
    const branch = filters.branch || "IGRCPG";
    const pool = getPool(branch);
    const { conditions, params } = FilterDetailStruk(filters);

    const query = `
        SELECT
            dtl_stat as station,
            dtl_kasir as kasir,
            username as nama_kasir,
            count(distinct dtl_struk) as jumlah_struk,
            count(distinct dtl_cusno) as jumlah_member,
            count(distinct dtl_prdcd_ctn) as jumlah_produk,
            sum(dtl_qty_pcs) as total_qty,
            sum(dtl_gross) as total_gross,
            sum(dtl_netto) as total_netto,
            sum(dtl_margin) as total_margin
        FROM
            (${DetailStruk(conditions, params)}) as dtl
        left join tbmaster_user as usr on dtl.dtl_kasir = usr.userid
        GROUP BY 
            dtl_stat,
            dtl_kasir,
            username
        HAVING count(dtl_netto) > 0
        ORDER BY dtl_stat, dtl_kasir
        `;

    const resultQuery = await pool.query(query, params);

    return res.status(200).json({
      success: true,
      data: resultQuery.rows,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
