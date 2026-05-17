import { NextApiRequest, NextApiResponse } from "next";
import { getPool, BranchType } from "@/lib/db";

/**
 * =========================================
 * 🔌 API ROUTE: SelectKategori
 * =========================================
 *
 * 📍 Endpoint: /api/select-kategori
 * 📄 File: src/pages/api/select-kategori.ts
 * 🧩 Handler: selectKategoriHandler
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
type SelectKategori = {
  dep_kodedepartement: string;
  dep_namadepartement: string;
  kat_kodekategori: string;
  kat_namakategori: string;
};

/**
 * Main handler untuk /api/select-kategori
 */
export default async function selectKategoriHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<SelectKategori[]>>,
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
        div_kodedivisi,
        div_namadivisi,
        dep_kodedepartement,
        dep_namadepartement,
        kat_kodekategori,
        kat_namakategori
        from tbmaster_kategori
      left join tbmaster_departement
           on dep_kodedepartement = kat_kodedepartement
      left join tbmaster_divisi
           on div_kodedivisi = dep_kodedivisi
      order by div_kodedivisi, dep_kodedepartement, kat_kodekategori;
    `;

    const branch = (req.query.branch as BranchType) || "IGRCPG";
    const pool = getPool(branch);
    const result = await pool.query(query);

    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("[ERROR] /api/select-kategori:", error);

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
