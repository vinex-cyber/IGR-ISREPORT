import { z } from "zod";

import { createGetHandler } from "@/lib/handlerFactory";
import type { QueryParam } from "@/types/queryParams";
import { getMemberSkiplist } from "@/utils/memberSkiplist";

const pickerDetailSchema = z.object({
  picker: z.string().min(1),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type PickerDetailFilters = z.infer<typeof pickerDetailSchema>;

// ponytail: daftar PB yang dipegang seorang picker; baris agregat per obi_nopb:
// pick_dt = MIN obi_pick_dt, close_dt = MAX obi_close_dt. CTE membatasi scan
// ke picker + periode (hindari agregat penuh tbtr_obi_d).
const buildQuery = (conditions: string, _params: QueryParam[]) => `
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
      AND c.cus_kodeigr = '01'
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

export default createGetHandler<PickerDetailFilters>({
  schema: pickerDetailSchema,
  buildFilters: (filters) => {
    const parts: string[] = [];
    const params: QueryParam[] = [`${filters.picker}`];

    if (filters.startDate && filters.endDate) {
      parts.push(`h.obi_tglpb >= $${params.length + 1} AND h.obi_tglpb < $${params.length + 2}`);
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
  },
  buildQuery,
  successMessage: `Data detail picker berhasil diambil.`,
  emptyMessage: `Tidak ada data PB untuk picker tersebut.`,
  errorContext: "Detail Picker",
  return404IfEmpty: false,
});