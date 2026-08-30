import { z } from "zod";

import { createGetHandler } from "@/lib/handlerFactory";
import type { QueryParam } from "@/types/queryParams";
import { getMemberSkiplist } from "@/utils/memberSkiplist";

// ponytail: query fixed (bulan ini, realisasi, status SELESAI STRUK), tanpa filter user
const buildQuery = (conditions: string, _params: QueryParam[]) => `
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
    AND c.cus_kodeigr = '01'
    ${conditions}
  GROUP BY substr(d.obi_prdcd, 1, 6) || '0'
  ORDER BY sum(d.obi_qtyrealisasi) DESC
  LIMIT 10
`;

export default createGetHandler<Record<string, never>>({
  schema: z.object({}),
  buildFilters: () => {
    const members = getMemberSkiplist();
    if (members.length === 0) return { conditions: "", params: [] };
    return {
      conditions: "AND NOT (c.cus_kodemember = ANY($1))",
      params: [members],
    };
  },
  buildQuery,
  successMessage: `Data 10 produk terlaris bulan ini berhasil diambil.`,
  emptyMessage: `Tidak ada produk terlaris untuk bulan ini.`,
  errorContext: "Produk Terlaris Bulan Ini",
  return404IfEmpty: false,
});
