// src/pages/api/klik/performa-picker.ts
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

const performaPickerSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type PerformaPickerFilters = z.infer<typeof performaPickerSchema>;

function buildFilters(filters: PerformaPickerFilters, kodeIgr: string) {
  const parts: string[] = [];
  const params: QueryParam[] = [];

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

// ponytail: filter tanggal via obi_tglpb; tanpa tanggal default bulan ini.
// Peringkat petugas picking dari tbtr_obi_d.obi_picker (join header via tgltrans+notrans).
function buildQuery(conditions: string): string {
  return `
  WITH src AS (
    SELECT
      d.obi_picker,
      h.obi_nopb,
      COALESCE(NULLIF(trim(u.username), ''), d.obi_picker) AS username
    FROM tbtr_obi_d d
    JOIN tbtr_obi_h h
      ON d.obi_notrans = h.obi_notrans
     AND d.obi_tgltrans = h.obi_tgltrans
    LEFT JOIN tbmaster_customer c
      ON h.obi_kdmember = c.cus_kodemember
    LEFT JOIN tbmaster_user u
      ON u.userid = d.obi_picker
    WHERE h.obi_recid NOT LIKE 'B%'
      AND coalesce(trim(d.obi_picker), '') <> ''
      AND coalesce(c.cus_jenismember,'-') <> 'T'
      ${conditions}
  ),
  totalpb AS MATERIALIZED (
    SELECT count(DISTINCT obi_nopb)::int AS total FROM src
  )
  SELECT
    row_number() OVER (ORDER BY count(DISTINCT s.obi_nopb) DESC)::int AS rank,
    COALESCE(NULLIF(trim(s.obi_picker), ''), 'tanpa picker') AS picker,
    upper(COALESCE(NULLIF(trim(min(s.username)), ''), s.obi_picker)) AS nama,
    count(DISTINCT s.obi_nopb)::int AS pb,
    t.total::int AS totalpb
  FROM src s
  CROSS JOIN totalpb t
  GROUP BY s.obi_picker, t.total
  ORDER BY count(DISTINCT s.obi_nopb) DESC
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

  const parsed = performaPickerSchema.safeParse(req.query);
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
      message: "Data performa picker berhasil diambil.",
      total: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    return handleServerError(res, error, branch, "Performa Picker");
  }
}