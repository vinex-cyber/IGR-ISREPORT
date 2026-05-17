// src/pages/api/select-suboutlet-member.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getPool, BranchType } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader("Cache-Control", "no-store"); // 🧹 Matikan cache di level HTTP

  try {
    const { kodeoutlet } = req.query;

    const query = `
            SELECT
                sub_kodeoutlet,
                out_namaoutlet,
                sub_kodesuboutlet,
                sub_namasuboutlet
            FROM
                tbmaster_suboutlet
            LEFT JOIN
                tbmaster_outlet ON sub_kodeoutlet = out_kodeoutlet
            WHERE
                ($1::text IS NULL OR sub_kodeoutlet = $1)
        `;

    const branch = (req.query.branch as BranchType) || "IGRCPG";
    const pool = getPool(branch);
    const result = await pool.query(query, [kodeoutlet || null]);
    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching sub outlet members:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
