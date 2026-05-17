import { NextApiRequest, NextApiResponse } from "next";
import { getPool, BranchType } from "@/lib/db";
import { DaftarMemberRows } from "@/configs/input/daftar-memberConfig";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  total?: number;
  message?: string;
  error?: string;
};

export default async function daftarMemberHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<DaftarMemberRows[]>>,
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

    // =========================
    // 🔥 QUERY PARAM
    // =========================
    const { page = "1", pageSize = "10", search = "" } = req.query;

    const limit = Number(pageSize);
    const offset = (Number(page) - 1) * limit;

    const keyword = String(search).trim();

    // =========================
    // 🔥 DATA QUERY (HYBRID SEARCH)
    // =========================
    const query = `
      SELECT
        cus_kodeigr,
        cus_kodemember,
        cus_namamember,
        CASE
            WHEN coalesce(cus_flagmemberkhusus,'N') = 'Y' THEN 'MERAH'
            ELSE 'BIRU'
        END             as jenis_member,

        -- 🔥 ranking gabungan
        (
          ts_rank_cd(
            to_tsvector('simple', cus_namamember),
            plainto_tsquery('simple', $1)
          )
          +
          CASE 
            WHEN cus_kodemember ILIKE $2 THEN 5.0  -- boost kalau match kode
            ELSE 0
          END
        ) AS rank

      FROM tbmaster_customer
    
      WHERE 
        cus_recordid IS NULL
        AND cus_namamember <> 'NEW'
        AND (
          $1 = '' OR
          to_tsvector('simple', cus_namamember)
            @@ plainto_tsquery('simple', $1)
          OR
          cus_kodemember ILIKE $2
        )

      ORDER BY 
      rank DESC,
      cus_kodeigr,
      cus_kodemember

      LIMIT $3 OFFSET $4
    `;

    const result = await pool.query(query, [
      keyword, // FTS
      `%${keyword}%`, // LIKE untuk kode
      limit,
      offset,
    ]);

    // =========================
    // 🔥 COUNT QUERY
    // =========================
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM tbmaster_customer
      WHERE 
        cus_recordid IS NULL
        AND (
          $1 = '' OR
          to_tsvector('simple', cus_namamember)
            @@ plainto_tsquery('simple', $1)
          OR
          cus_kodemember ILIKE $2
        )
    `;

    const countResult = await pool.query(countQuery, [keyword, `%${keyword}%`]);

    return res.status(200).json({
      success: true,
      data: result.rows,
      total: Number(countResult.rows[0].total),
    });
  } catch (error) {
    console.error("[ERROR] /api/daftar-member:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : String(error)
          : undefined,
    });
  }
}
