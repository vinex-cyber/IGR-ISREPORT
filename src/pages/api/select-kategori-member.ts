import { NextApiRequest, NextApiResponse } from "next";
import { getPool, BranchType } from "@/lib/db";

/**
 * =========================================
 * 🔌 API ROUTE: SelectKategoriMember
 * =========================================
 *
 * 📍 Endpoint: /api/select-kategori-member
 * 📄 File: src/pages/api/select-kategori-member.ts
 * 🧩 Handler: selectKategoriMemberHandler
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
type SelectKategoriMember = {
  // contoh:
  grp_idgroupkat: string;
  grp_kategori: string;
  grp_subkategori: string;
};

/**
 * Main handler untuk /api/select-kategori-member
 */
export default async function selectKategoriMemberHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<SelectKategoriMember[]>>,
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
        grp_idgroupkat,
        grp_group,
        grp_kategori,
        grp_subkategori
      from tbtabel_groupkategori
      order by grp_group desc, grp_kategori asc;
    `;

    const branch = (req.query.branch as BranchType) || "IGRCPG";
    const pool = getPool(branch);
    const result = await pool.query(query);

    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("[ERROR] /api/select-kategori-member:", error);

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
