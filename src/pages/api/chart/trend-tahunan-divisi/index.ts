// src/pages/api/chart/trend-tahunan-divisi/index.ts
import type { NextApiRequest, NextApiResponse } from "next";

import { checkMethod, handleServerError } from "@/lib/apiHandler";
import { getPool } from "@/lib/db";
import { getRequestBranch } from "@/utils/getRequestBranch";
import {
  QueryTrendTahunanDivisi,
} from "@/utils/query/queryTrendTahunanDivisi";
import type { RekapSource } from "@/utils/query/queryTrendTahunan";

// ponytail: pengecualian dari createGetHandler — nama tabel arsip harus
// di-resolve async sebelum build query (sama dengan trend-tahunan).
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

  const branch = getRequestBranch(req);
  const metric = req.query.metric === "margin" ? "margin" : "sales";
  const curYear = new Date().getFullYear();

  try {
    const pool = getPool(branch);
    const rekap: RekapSource[] = await Promise.all(
      [curYear - 2, curYear - 1].map(async (year) => ({
        year,
        table: await resolveRekapTable(pool, year),
      })),
    );

    const result = await pool.query(QueryTrendTahunanDivisi(rekap), [metric]);
    return res.status(200).json({
      success: true,
      message: "Data trend tahunan per divisi berhasil diambil.",
      total: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    return handleServerError(res, error, branch, "Chart Trend Tahunan Divisi");
  }
}
