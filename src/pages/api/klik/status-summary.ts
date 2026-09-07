// api/klik/status-summary.ts
import { createGetHandler } from "@/lib/handlerFactory";
import { klikSchemas } from "@/schema/klik/klikSchemas";
import type { QueryParam } from "@/types/queryParams";

// ponytail: status belum selesai (1,2,3,5,COD) dihitung semua masa;
// SELESAI STRUK (6) hanya per hari ini.
// TMI (flagTmi='N') = dibatasi sama persis dengan backend cpg-vite:
// bukan member cus_jenismember='T' DAN obi_attribute2 <> 'TMI'.
const buildQuery = (_conditions: string, _params: QueryParam[]) => `
WITH all_status AS (
  SELECT h.obi_recid, h.obi_tipebayar
  FROM tbtr_obi_h h
  WHERE h.obi_kdmember NOT IN (
        SELECT cus_kodemember FROM tbmaster_customer WHERE cus_jenismember = 'T')
    AND h.obi_attribute2 <> 'TMI'
),
today AS (
  SELECT h.obi_recid
  FROM tbtr_obi_h h
  WHERE date_trunc('day', h.obi_tglpb) = date_trunc('day', now())
    AND h.obi_kdmember NOT IN (
        SELECT cus_kodemember FROM tbmaster_customer WHERE cus_jenismember = 'T')
    AND h.obi_attribute2 <> 'TMI'
)
SELECT '1' AS key, count(*)::int AS total FROM all_status WHERE obi_recid = '1'
UNION ALL SELECT '2', count(*)::int FROM all_status WHERE obi_recid = '2'
UNION ALL SELECT '3', count(*)::int FROM all_status WHERE obi_recid = '3'
UNION ALL SELECT '5', count(*)::int FROM all_status WHERE obi_recid = '5'
UNION ALL SELECT '6', count(*)::int FROM today WHERE obi_recid = '6'
UNION ALL SELECT 'COD', count(*)::int FROM all_status
  WHERE obi_tipebayar = 'COD' AND obi_recid <> '6' AND obi_recid NOT LIKE 'B%'
`;

export default createGetHandler({
  schema: klikSchemas,
  buildFilters: () => ({ conditions: "", params: [] }),
  buildQuery,
  successMessage: (_branch) =>
    "Data ringkasan status Klik berhasil diambil.",
  emptyMessage: (_branch) => "Tidak ada data status Klik.",
  errorContext: "Ringkasan Status Klik",
  return404IfEmpty: false,
});