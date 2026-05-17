import { NextApiRequest, NextApiResponse } from "next";
import { getPool, BranchType } from "@/lib/db";
import { DaftarGiftRows } from "@/configs/input/daftar-giftConfig";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  total?: number;
  message?: string;
  error?: string;
};

export default async function daftarGiftHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<DaftarGiftRows[]>>,
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    // 🔥 branch
    const branch = (req.query.branch as BranchType) || "IGRCPG";

    // 🔥 database pool
    const pool = getPool(branch);

    // 🔥 ambil query param
    const page = Number(req.query.page ?? "1");
    const pageSize = Number(req.query.pageSize ?? "10");
    const search = String(req.query.search ?? "");

    const limit = pageSize;
    const offset = (page - 1) * limit;

    const keyword = `%${search.toLowerCase()}%`;

    // 🔥 main query
    const result = await pool.query(
      `
      select
        gfh_kodepromosi,
        gfh_namapromosi,
        to_char(gfh_tglawal, 'YYYY-MM-DD') gfh_tglawal,
        to_char(gfh_tglakhir, 'YYYY-MM-DD') gfh_tglakhir,
        case
          when gfh_tglakhir >= current_date then 'AKTIF'
          else 'NON AKTIF'
        end gfh_status
      from tbtr_gift_hdr
      where 
        lower(gfh_kodepromosi) like $1
        or lower(gfh_namapromosi) like $1
      order by gfh_tglakhir desc
      limit $2 offset $3
      `,
      [keyword, limit, offset],
    );

    // 🔥 total count
    const countResult = await pool.query(
      `
      select count(*) 
      from tbtr_gift_hdr
      where 
        lower(gfh_kodepromosi) like $1
        or lower(gfh_namapromosi) like $1
      `,
      [keyword],
    );

    return res.status(200).json({
      success: true,
      data: result.rows,
      total: Number(countResult.rows[0].count),
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    return res.status(500).json({
      success: false,
      message: "DB connection failed",
      error: errorMessage,
    });
  }
}
