import { NextApiRequest, NextApiResponse } from "next";
import { getPool, BranchType } from "@/lib/db";

/**
 * =========================================
 * 🔌 API ROUTE: SelectDepartement
 * =========================================
 *
 * 📍 Endpoint: /api/select-departement
 * 📄 File: src/pages/api/select-departement.ts
 * 🧩 Handler: selectDepartementHandler
 *
 * 📌 Supported Methods:
 * - GET    → Fetch data
 * - POST   → Create new resource
 * - PUT    → Update existing resource
 * - DELETE → Remove resource
 *
 * 📌 Tips:
 * - Gunakan try-catch untuk error handling
 * - Return JSON dengan status code yang sesuai
 * - Validasi input dengan Zod/Joi jika perlu
 * - Untuk auth, cek session/token di middleware
 */

type Departement = {
  dep_kodedivisi: string;
  dep_kodedepartment: string;
  dep_namadepartment: string;
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Departement[]>>,
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
                div_namadivisi,
                dep_kodedepartement,
                dep_namadepartement
            FROM
                tbmaster_departement
            left join tbmaster_divisi on dep_kodedivisi = div_kodedivisi
            ORDER BY
                dep_kodedivisi,
                dep_kodedepartement
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
