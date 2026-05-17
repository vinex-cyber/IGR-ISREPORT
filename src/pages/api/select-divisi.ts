// src/pages/api/select-divisi.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getPool, BranchType } from "@/lib/db";

type Divisi = {
  div_kodedivisi: string;
  div_namadivisi: string;
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Divisi[]>>,
) {
  // 🔥 hanya GET
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const query = `
            SELECT
                div_kodedivisi,
                div_namadivisi
            FROM
                tbmaster_divisi
            ORDER BY
                div_kodedivisi
        `;

    const branch = (req.query.branch as BranchType) || "IGRCPG";
    const pool = getPool(branch);
    const result = await pool.query(query);

    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching divisions:", error);

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
