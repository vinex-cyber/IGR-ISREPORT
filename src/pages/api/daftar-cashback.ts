// src/pages/api/daftar-cashback.ts

import { NextApiRequest, NextApiResponse } from "next";
import { getPool, BranchType } from "@/lib/db";
import { DaftarCashbackRows } from "@/configs/input/daftar-cashbackConfig";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  total?: number;
  message?: string;
  error?: string;
};

export default async function daftarCashbackHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<DaftarCashbackRows[]>>,
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

    // 🔥 query param
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
        cbh_kodepromosi,
        cbh_namapromosi,
        to_char(cbh_tglawal, 'YYYY-MM-DD') cbh_tglawal,
        to_char(cbh_tglakhir, 'YYYY-MM-DD') cbh_tglakhir,
        case
            when cbh_tglakhir >= current_date then 'AKTIF'
            else 'NON AKTIF'
        end cbh_status
      from tbtr_cashback_hdr
      where 
        lower(cbh_kodepromosi) like $1
        or lower(cbh_namapromosi) like $1
      order by cbh_tglakhir desc
      limit $2 offset $3
      `,
      [keyword, limit, offset],
    );

    // 🔥 total count
    const countResult = await pool.query(
      `
      select count(*) 
      from tbtr_cashback_hdr
      where 
        lower(cbh_kodepromosi) like $1
        or lower(cbh_namapromosi) like $1
      `,
      [keyword],
    );

    return res.status(200).json({
      success: true,
      total: Number(countResult.rows[0].count),
      data: result.rows,
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
