// src/pages/api/klik/performa-picker-detail.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

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

const pickerDetailSchema = z.object({
  picker: z.string().min(1),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type PickerDetailFilters = z.infer<typeof pickerDetailSchema>;

function buildFilters(filters: PickerDetailFilters, kodeIgr: string) {
  const parts: string[] = [];
  const params: QueryParam[] = [`${filters.picker}`];

  parts.push(`c.cus_kodeigr = $${params.length + 1}`);
  params.push(kodeIgr);

  if (filters.startDate && filters.endDate) {
    parts.push(
      `h.obi_tglpb >= $${params.length + 1} AND h.obi_tglpb < $${params.length + 2}`,
    );
    params.push(`${filters.startDate} 00:00:00`, `${filters.endDate} 23:59:59`);
  } else if (filters.startDate) {
    parts.push(`h.obi_tglpb >= $${params.length + 1}`);
    params.push(`${filters.startDate} 00:00:00`);
  } else if (filters.endDate) {
    parts.push(`h.obi_tglpb < $${params.length + 1}`);
    params.push(`${filters.endDate} 23:59:59`);
  } else {
    parts.push(`date_trunc('month', h.obi_tglpb) = date_trunc('month', now())`);
  }

  const members = getMemberSkiplist();
  if (members.length > 0) {
    parts.push(`NOT (c.cus_kodemember = ANY($${params.length + 1}))`);
    params.push(members);
  }

  return {
    conditions: parts.length > 0 ? `AND ${parts.join(" AND ")}` : "",
    params,
  };
}

// ponytail: daftar PB yang dipegang seorang picker; baris agregat per obi_nopb:
// pick_dt = MIN obi_pick_dt, close_dt = MAX obi_close_dt. CTE membatasi scan
// ke picker + periode (hindari agregat penuh tbtr_obi_d).
function buildQuery(conditions: string): string {
  return `
  WITH pick_lines AS (
    SELECT
      upper(COALESCE(NULLIF(trim(u.username), ''), $1)) AS username,
      h.obi_recid,
      h.obi_nopb,
      h.obi_tglpb,
      h.obi_tgltrans,
      h.obi_notrans,
      h.obi_itemorder::int AS obi_itemorder,
      h.obi_realitem::int AS obi_realitem,
      d.obi_pick_dt,
      d.obi_close_dt
    FROM tbtr_obi_h h
    JOIN tbtr_obi_d d
      ON d.obi_notrans = h.obi_notrans
     AND d.obi_tgltrans = h.obi_tgltrans
     AND coalesce(trim(d.obi_picker), '') = $1
    LEFT JOIN tbmaster_user u
      ON u.userid = $1
    LEFT JOIN tbmaster_customer c
      ON h.obi_kdmember = c.cus_kodemember
    WHERE h.obi_recid NOT LIKE 'B%'
      AND coalesce(c.cus_jenismember,'-') <> 'T'
      ${conditions}
  )
  SELECT
    username,
    obi_recid,
    obi_nopb,
    obi_tglpb,
    obi_tgltrans,
    obi_notrans,
    obi_itemorder,
    obi_realitem,
    min(obi_pick_dt) AS pick_dt,
    max(obi_close_dt) AS close_dt
  FROM pick_lines
  GROUP BY username, obi_recid, obi_nopb, obi_tglpb, obi_tgltrans, obi_notrans, obi_itemorder, obi_realitem
  ORDER BY obi_tglpb ASC, obi_nopb
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

  const parsed = pickerDetailSchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Query parameter tidak valid.",
      errors: parsed.error.flatten(),
    });
  }

  const branch = getRequestBranch(req);
  const kodeIgr = getKodeIgr(branch);

  try {
    const pool = getPool(branch);
    const { conditions, params } = buildFilters(parsed.data, kodeIgr);
    const result = await pool.query({
      text: buildQuery(conditions),
      values: params.length > 0 ? params : undefined,
    });

    return res.status(200).json({
      success: true,
      message: "Data detail picker berhasil diambil.",
      total: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    return handleServerError(res, error, branch, "Detail Picker");
  }
}