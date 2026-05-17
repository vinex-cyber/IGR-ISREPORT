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
        to_char(dtl_tanggal, 'dd-MM-yyyy') as tanggal,
            dtl_k_div as div,
            dtl_k_dept as dept,
            dtl_k_katb as kategori,
            dtl_prdcd_ctn as plu,
            dtl_nama_barang as nama_produk,
            count(distinct dtl_cusno) as jumlah_member,
            count(distinct dtl_struk) as jumlah_struk,
            sum(dtl_qty_pcs) as total_qty,
            sum(dtl_gross) as total_gross,
            sum(dtl_netto) as total_netto,
            sum(dtl_margin) as total_margin
        FROM
            (${DetailStruk(conditions, params)}) as dtl
        GROUP BY dtl_k_div, dtl_k_dept, dtl_k_katb, dtl_prdcd_ctn, dtl_nama_barang, to_char(dtl_tanggal, 'dd-MM-yyyy'),to_char(dtl_tanggal, 'yyyymmdd')
        HAVING count(dtl_netto) > 0
        ORDER BY to_char(dtl_tanggal, 'yyyymmdd'),dtl_k_div, dtl_k_dept, dtl_k_katb, dtl_prdcd_ctn
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
