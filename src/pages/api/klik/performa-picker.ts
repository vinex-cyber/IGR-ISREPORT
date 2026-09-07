import { z } from "zod";

import { createGetHandler } from "@/lib/handlerFactory";
import type { QueryParam } from "@/types/queryParams";
import { getMemberSkiplist } from "@/utils/memberSkiplist";

const performaPickerSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type PerformaPickerFilters = z.infer<typeof performaPickerSchema>;

// ponytail: filter tanggal via obi_tglpb; tanpa tanggal default bulan ini.
// Peringkat petugas picking dari tbtr_obi_d.obi_picker (join header via tgltrans+notrans).
const buildQuery = (conditions: string, _params: QueryParam[]) => `
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
      AND c.cus_kodeigr = '01'
      ${conditions}
  ),
  totalpb AS (
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

export default createGetHandler<PerformaPickerFilters>({
  schema: performaPickerSchema,
  buildFilters: (filters) => {
    const parts: string[] = [];
    const params: QueryParam[] = [];

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
  successMessage: `Data performa picker berhasil diambil.`,
  emptyMessage: `Tidak ada performa picker untuk periode tersebut.`,
  errorContext: "Performa Picker",
  return404IfEmpty: false,
});