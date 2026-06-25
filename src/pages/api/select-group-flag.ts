// src/pages/api/select-group-flag.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getPool, BranchType } from "@/lib/db";
import { QueryGroupFlag } from "@/utils/query/queryGroupFlag";

type Flag = {
  flag: string;
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Flag[]>>,
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
            SELECT DISTINCT
                flag
            FROM
                (${QueryGroupFlag()}) AS Flag
        `;

    const branch = (req.query.branch as BranchType) || "IGRCPG";
    const pool = getPool(branch);
    const result = await pool.query(query);

    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching group flags:", error);

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
