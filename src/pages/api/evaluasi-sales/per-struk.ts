import { NextApiRequest, NextApiResponse } from "next";
import { getPool } from "@/lib/db";
import { FilterDetailStruk } from "@/utils/filters/FiltersDetailStruk"; // pastikan import benar
import { FilterDetailStrukSchema } from "@/schema/filterDetailStruk"; // pastikan import benar
import { DetailStruk } from "@/utils/query/detailStruk";

export const config = {
  api: {
    responseLimit: "10mb",
  },
};
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
