import { NextApiRequest, NextApiResponse } from "next";
import { getPool, BranchType } from "@/lib/db";

/**
 * =========================================
 * 🔌 API ROUTE: DaftarSupplier
 * =========================================
 *
 * 📍 Endpoint: /api/daftar-supplier
 * 📄 File: src/pages/api/daftar-supplier.ts
 * 🧩 Handler: daftarSupplierHandler
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
type DaftarSupplier = {
  // contoh:
  id?: string;
};

/**
 * Main handler untuk /api/daftar-supplier
 */
export default async function daftarSupplierHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<DaftarSupplier[]>>,
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
        hgb_kodesupplier,
        sup_namasupplier,
        count(*) ttl_plu
      from tbmaster_prodmast
      left join tbmaster_hargabeli on hgb_prdcd = prd_prdcd
      left join tbmaster_supplier on hgb_kodesupplier = sup_kodesupplier
      where coalesce(prd_kodetag,'-') not in ('X','N','O')
      and hgb_tipe = '2'
      group by hgb_kodesupplier, sup_namasupplier
    `;

    const branch = (req.query.branch as BranchType) || "IGRCPG";
    const pool = getPool(branch);

    const result = await pool.query(query);

    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("[ERROR] /api/daftar-supplier:", error);

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
