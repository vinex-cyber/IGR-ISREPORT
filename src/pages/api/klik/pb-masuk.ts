// src/pages/api/klik/pb-masuk.ts
import type { NextApiRequest, NextApiResponse } from "next";

import { checkMethod, handleServerError } from "@/lib/apiHandler";
import { getPool } from "@/lib/db";
import { getRequestBranch } from "@/utils/getRequestBranch";

// ponytail: count PB yang masuk hari ini (ringan), bukan seluruh detail order.
// Query berat status-order dipakai di modal; tile "PB masuk" cuma butuh angka.
// pisahkan dari status-order agar polling tiap menit tidak menarik query detail.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkMethod(req, res, "GET")) return;

  const branch = getRequestBranch(req);

  try {
    const pool = getPool(branch);
    const result = await pool.query({
      text: `SELECT count(*)::int AS total
FROM tbtr_obi_h h
WHERE h.obi_tglpb >= now()::date
  AND h.obi_tglpb < now()::date + interval '1 day'
  AND NOT EXISTS (SELECT 1 FROM tbmaster_customer c
    WHERE c.cus_kodemember = h.obi_kdmember AND c.cus_jenismember = 'T')
  AND h.obi_attribute2 <> 'TMI'`,
    });

    return res.status(200).json({
      success: true,
      message: "Jumlah PB masuk hari ini berhasil diambil.",
      total: result.rows[0].total,
      data: [],
    });
  } catch (error) {
    return handleServerError(res, error, branch, "PB Masuk Hari Ini");
  }
}