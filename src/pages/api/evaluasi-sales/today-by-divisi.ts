// src/pages/api/evaluasi-sales/today-by-divisi.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getPool } from "@/lib/db";
import { checkMethod, handleServerError } from "@/lib/apiHandler";
import { getRequestBranch } from "@/utils/getRequestBranch";
import { TodaySalesByDivisiQuery } from "@/utils/query/queryTodaySales";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!checkMethod(req, res, "GET")) return;

  const branch = getRequestBranch(req);

  try {
    const pool = getPool(branch);
    const result = await pool.query(TodaySalesByDivisiQuery());

    const rows = result.rows.map((r) => ({
      namadivisi: String(r.namadivisi),
      netto: Number(r.netto),
      margin: Number(r.margin),
      jumlah_produk: Number(r.jumlah_produk),
    }));

    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    return handleServerError(res, error, branch, "Today By Divisi");
  }
}
