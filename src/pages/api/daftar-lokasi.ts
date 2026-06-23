import { NextApiRequest, NextApiResponse } from "next";
import { getPool, BranchType } from "@/lib/db";

/**
 * =========================================
 * 🔌 API ROUTE: DaftarLokasi
 * =========================================
 *
 * 📍 Endpoint: /api/daftar-lokasi
 * 📄 File: src/pages/api/daftar-lokasi.ts
 * 🧩 Handler: daftarLokasiHandler
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
  st_lokasi: string;
  nama_lokasi: string;
};

/**
 * Main handler untuk /api/daftar-lokasi
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
      select DISTINCT 
        st_lokasi,
      CASE
        when st_lokasi = '01' THEN 'BARANG BAIK'
        when st_lokasi = '02' THEN 'BARANG RETUR'
        when st_lokasi = '03' THEN 'BARANG RUSAK'
      END nama_lokasi
      from tbmaster_stock
      order by st_lokasi
    `;

    const branch = (req.query.branch as BranchType) || "IGRCPG";
    const pool = getPool(branch);

    const result = await pool.query(query);

    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("[ERROR] /api/daftar-lokasi:", error);

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
