import { NextApiRequest, NextApiResponse } from "next";
import { getPool, BranchType } from "@/lib/db";

/**
 * =========================================
 * 🔌 API ROUTE: DaftarKodeKasir
 * =========================================
 *
 * 📍 Endpoint: /api/daftar-kodekasir
 * 📄 File: src/pages/api/daftar-kodekasir.ts
 * 🧩 Handler: daftarKodeKasirHandler
 *
 * 📌 Supported Methods:
 * - GET → Fetch data
 */

// 🔥 Response Generic Type
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};

// 🔥 Data Type (ubah sesuai kebutuhan)
type DaftarKodeKasir = {
  // contoh:
  userid: string;
  username: string;
};

/**
 * Main handler untuk /api/daftar-kodekasir
 */
export default async function daftarKodeKasirHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<DaftarKodeKasir[]>>,
) {
  // 🔥 hanya GET
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    // 🔥 TODO: Ganti query sesuai kebutuhan
    const query = `
      SELECT 
        DISTINCT(userid),
        username
      FROM tbmaster_user
      LEFT JOIN tbtr_jualheader on userid = jh_cashierid
        where jh_transactiondate >= current_date - INTERVAL '2 MONTH'
        AND jh_transactiondate <= current_date
        order by userid;
    `;

    const branch = (req.query.branch as BranchType) || "IGRCPG";
    const pool = getPool(branch);

    const result = await pool.query(query);

    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("[ERROR] /api/daftar-kodekasir:", error);

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
