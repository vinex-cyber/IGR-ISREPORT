import { NextApiRequest, NextApiResponse } from "next";
import { getPool, BranchType } from "@/lib/db";
import { DaftarMonitoringpluRows } from "@/configs/input/daftar-monitoringpluConfig";

/**
 * =========================================
 * 🔌 API ROUTE: DaftarMonitoringplu
 * =========================================
 *
 * 📍 Endpoint: /api/daftar-monitoringplu
 * 📄 File: src/pages/api/daftar-monitoringplu.ts
 * 🧩 Handler: daftarMonitoringpluHandler
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

export default async function daftarMonitoringpluHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<DaftarMonitoringpluRows[]>>,
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
      select
        kodemonitoring,
        namamonitoring,
        count(mpl_prdcd) as ttl_plu
      from tbmaster_kodemonitoringplu
      left join tbtr_monitoringplu on kodemonitoring = mpl_kodemonitoring
      group by kodemonitoring, namamonitoring
      order by 1 asc;
    `;

    const branch = (req.query.branch as BranchType) || "IGRCPG";
    const pool = getPool(branch);

    const result = await pool.query(query);

    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res
      .status(500)
      .json({
        success: false,
        message: "DB connection failed",
        error: errorMessage,
      });
  }
}
