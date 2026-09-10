// src/pages/api/klik/produk-terlaris.ts
import type { NextApiRequest, NextApiResponse } from "next";

import { checkMethod, handleServerError } from "@/lib/apiHandler";
import { getPool } from "@/lib/db";
import type { QueryParam } from "@/types/queryParams";
import { getRequestBranch } from "@/utils/getRequestBranch";
import { getMemberSkiplist } from "@/utils/memberSkiplist";

// ponytail: kode `cus_kodeigr` pemilik data Klik mengikuti nama branch
// (SPICPG1I→'1I', SPICPG4L→'4L', IGRCPG→'01'). Branch di-resolve server-side
// via getRequestBranch (cookie → IP), lalu dilempar sebagai SQL param.
function getKodeIgr(branch: string): string {
  return branch === "IGRCPG" ? "01" : branch.slice(-2);
}

function buildFilters(kodeIgr: string) {
  const parts: string[] = [];
  const params: QueryParam[] = [];

  parts.push(`c.cus_kodeigr = $${params.length + 1}`);
  params.push(kodeIgr);

  const members = getMemberSkiplist();
  if (members.length > 0) {
    parts.push(`NOT (c.cus_kodemember = ANY($${params.length + 1}))`);
    params.push(members);
  }

  return { conditions: `AND ${parts.join(" AND ")}`, params };
}

// ponytail: query fixed (bulan ini, realisasi, status SELESAI STRUK), tanpa filter user
function buildQuery(conditions: string): string {
  return `
  SELECT
    row_number() OVER (ORDER BY sum(d.obi_qtyrealisasi) DESC)::int AS rank,
    substr(d.obi_prdcd, 1, 6) || '0' AS prdcd_ctn,
    min(COALESCE(NULLIF(trim(p.prd_deskripsipanjang), ''), d.obi_prdcd)) AS nama,
    COALESCE(min(p.prd_frac), 1)::float8 AS frac,
    sum(d.obi_qtyrealisasi)::float8 AS qty,
    sum(d.obi_qtyrealisasi * d.obi_hargasatuan)::float8 AS omzet
  FROM tbtr_obi_d d
  JOIN tbtr_obi_h h
    ON d.obi_notrans = h.obi_notrans
   AND d.obi_tgltrans = h.obi_tgltrans
  LEFT JOIN tbmaster_prodmast p
    ON substr(d.obi_prdcd, 1, 6) || '0' = p.prd_prdcd
  LEFT JOIN tbmaster_customer c
    ON h.obi_kdmember = c.cus_kodemember
  WHERE h.obi_recid = '6'
    AND date_trunc('month', h.obi_tglpb) = date_trunc('month', now())
    AND d.obi_qtyrealisasi <> 0
    AND coalesce(c.cus_jenismember,'-') <> 'T'
    ${conditions}
  GROUP BY substr(d.obi_prdcd, 1, 6) || '0'
  ORDER BY sum(d.obi_qtyrealisasi) DESC
  LIMIT 10
  `;
}

// ponytail: pengecualian dari createGetHandler (rujukan: api/chart/trend-tahunan) —
// query butuh nilai per-branch (kodeigr) yang baru bisa di-resolve dari request,
// sedangkan buildFilters/buildQuery factory tidak menerima branch.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!checkMethod(req, res, "GET")) return;

  const branch = getRequestBranch(req);
  const kodeIgr = getKodeIgr(branch);

  try {
    const pool = getPool(branch);
    const { conditions, params } = buildFilters(kodeIgr);
    const result = await pool.query({
      text: buildQuery(conditions),
      values: params.length > 0 ? params : undefined,
    });

    return res.status(200).json({
      success: true,
      message: "Data 10 produk terlaris bulan ini berhasil diambil.",
      total: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    return handleServerError(res, error, branch, "Produk Terlaris Bulan Ini");
  }
}