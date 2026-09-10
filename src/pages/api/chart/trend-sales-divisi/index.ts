// /src/pages/api/chart/trend-sales-divisi/index.ts
import type { NextApiRequest, NextApiResponse } from "next";

import { checkMethod, handleServerError } from "@/lib/apiHandler";
import { getPool } from "@/lib/db";
import {
  TrendSalesDivisiSchema,
} from "@/schema/store/informasiPromosiSchema";
import { getRequestBranch } from "@/utils/getRequestBranch";
import { QueryTrendSalesByDivisi } from "@/utils/query/queryTrendSalesByDivisi";

// ponytail: pengecualian dari createGetHandler (rujukan: api/chart/trend-tahunan) —
// nama tabel arsip harus di-resolve async sebelum build query; tidak semua
// branch punya snapshot tbtr_rekapsalesbulanan_{tahun}_12 yang sama,
// kalau dipaksakan → 500 (pola bug SPI dulu).
async function resolveRekapTable(
  pool: ReturnType<typeof getPool>,
  year: number,
): Promise<string | null> {
  const result = await pool.query(
    `SELECT MAX(table_name) AS table_name
     FROM information_schema.tables
     WHERE table_name LIKE $1 AND table_name ~ '_[0-9]{2}$'`,
    [`tbtr_rekapsalesbulanan_${year}_%`],
  );
  return result.rows[0]?.table_name ?? null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!checkMethod(req, res, "GET")) return;

  const parsed = TrendSalesDivisiSchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Query parameter tidak valid.",
      errors: parsed.error.flatten(),
    });
  }

  const branch = getRequestBranch(req);
  const divisi = parsed.data.divisi;

  try {
    const pool = getPool(branch);
    const arsip = await resolveRekapTable(pool, new Date().getFullYear() - 1);

    const result = await pool.query({
      text: QueryTrendSalesByDivisi(arsip, divisi || undefined),
      values: divisi ? [divisi] : undefined,
    });

    return res.status(200).json({
      success: true,
      message: "Data trend sales per divisi berhasil diambil.",
      total: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    return handleServerError(res, error, branch, "Trend Sales Per Divisi");
  }
}