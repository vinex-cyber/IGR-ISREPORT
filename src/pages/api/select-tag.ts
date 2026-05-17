import { NextApiRequest, NextApiResponse } from "next";
import { getPool, BranchType } from "@/lib/db";

/**
 * =========================================
 * 🔌 API ROUTE: SelectTag
 * =========================================
 *
 * 📍 Endpoint: /api/select-tag
 * 📄 File: src/pages/api/select-tag.ts
 * 🧩 Handler: selectTagHandler
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
type SelectTag = {
  tag_kodetag: string;
  tag_keterangan: string;
};

/**
 * Main handler untuk /api/select-tag
 */
export default async function selectTagHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<SelectTag[]>>,
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
        tag_kodetag,
        tag_keterangan
      from tbmaster_tag
      order by tag_kodetag
    `;

    const branch = (req.query.branch as BranchType) || "IGRCPG";
    const pool = getPool(branch);
    const result = await pool.query(query);

    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("[ERROR] /api/select-tag:", error);

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
