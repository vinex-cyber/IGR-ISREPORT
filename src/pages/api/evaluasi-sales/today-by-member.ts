// src/pages/api/evaluasi-sales/today-by-member.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getPool } from "@/lib/db";
import { checkMethod, handleServerError } from "@/lib/apiHandler";
import { getRequestBranch } from "@/utils/getRequestBranch";
import { TodaySalesByMemberQuery } from "@/utils/query/queryTodaySales";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!checkMethod(req, res, "GET")) return;

  const branch = getRequestBranch(req);

  try {
    const pool = getPool(branch);
    const [memberRes, kasirRes] = await Promise.all([
      pool.query(TodaySalesByMemberQuery()),
      pool.query(`
        SELECT count(*) AS jumlah_kasir
        FROM TBTR_JUALSUMMARY
        WHERE JS_RESETAMT = 0 AND js_cashdrawerend IS NULL
      `),
    ]);

    const jumlahKasir = Number(kasirRes.rows[0]?.jumlah_kasir ?? 0);

    const rows = memberRes.rows.map((r) => ({
      jenis: String(r.jenis_member),
      tanggal: String(r.tanggal),
      jumlah_member: Number(r.jumlah_member),
      jumlah_struk: Number(r.jumlah_struk),
      jumlah_produk: Number(r.jumlah_produk),
      total_qty: Number(r.total_qty),
      total_gross: Number(r.total_gross),
      total_netto: Number(r.total_netto),
      total_margin: Number(r.total_margin),
      jumlah_kasir: jumlahKasir,
    }));

    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    return handleServerError(res, error, branch, "Today By Member");
  }
}
