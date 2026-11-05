// api/klik/status-summary.ts
import { createGetHandler } from "@/lib/handlerFactory";
import { klikSchemas } from "@/schema/klik/klikSchemas";
import type { QueryParam } from "@/types/queryParams";

// ponytail: status belum selesai (1,2,3,5,COD) dihitung semua masa;
// SELESAI STRUK (6) hanya per hari ini; BELUM_SERAH dibatasi 2 bulan berjalan
// (recid 5/6 yang PB-nya belum ada di tbtr_serahterima_ipp, kecuali ekspedisi
// 'Ambil di Toko Indogrosir', 'Ambil di Stock Point Indogrosir',
// 'MOBIL ENGKEL/DOUBLE' & ekspedisi kosong (order Corp/TOP tanpa kurir,
// mis. '3703556/cor/09/2026') — keempatnya 0% tercatat di
// tbtr_serahterima_ipp di semua branch, jadi memang tidak lewat serah
// terima IPP.
// 'Indopaket Nusantara' TIDAK dibuang: 64,7% sudah tercatat — kurir IPP biasa.
// TMI (flagTmi='N') = dibatasi sama persis dengan backend cpg-vite:
// bukan member cus_jenismember='T' DAN obi_attribute2 <> 'TMI'.
// Scan tbtr_obi_h sekali (base MATERIALIZED) bukan 3x (all_status/today/recent)
// biar lebih cepat di cold start.
const buildQuery = (_conditions: string, _params: QueryParam[]) => `
WITH base AS MATERIALIZED (
  SELECT h.obi_recid, h.obi_tipebayar, h.obi_nopb, h.obi_kdekspedisi, h.obi_tglpb
  FROM tbtr_obi_h h
  WHERE NOT EXISTS (
    SELECT 1 FROM tbmaster_customer c
    WHERE c.cus_kodemember = h.obi_kdmember AND c.cus_jenismember = 'T')
    AND h.obi_attribute2 <> 'TMI'
)
SELECT '1' AS key, count(*)::int AS total FROM base WHERE obi_recid = '1'
UNION ALL SELECT '2', count(*)::int FROM base WHERE obi_recid = '2'
UNION ALL SELECT '3', count(*)::int FROM base WHERE obi_recid = '3'
UNION ALL SELECT '5', count(*)::int FROM base WHERE obi_recid = '5'
UNION ALL SELECT '6', count(*)::int FROM base
  WHERE obi_recid = '6'
    AND obi_tglpb >= now()::date
    AND obi_tglpb < now()::date + interval '1 day'
UNION ALL SELECT 'COD', count(*)::int FROM base
  WHERE obi_tipebayar = 'COD'
    AND obi_recid <> '6'
    AND obi_recid NOT LIKE 'B%'
UNION ALL SELECT 'BELUM_SERAH', count(*)::int FROM base
  WHERE obi_recid IN ('5','6')
    AND obi_tglpb >= date_trunc('month', now() - interval '1 month')
    AND btrim(coalesce(obi_kdekspedisi, '')) NOT IN ('', 'Ambil di Toko Indogrosir', 'Ambil di Stock Point Indogrosir', 'MOBIL ENGKEL/DOUBLE')
    AND NOT EXISTS (
      SELECT 1 FROM tbtr_serahterima_ipp s
      WHERE s.sti_codpaymentcode = base.obi_nopb)
`;

export default createGetHandler({
  schema: klikSchemas,
  buildFilters: () => ({ conditions: "", params: [] }),
  buildQuery,
  successMessage: (_branch) => "Data ringkasan status Klik berhasil diambil.",
  emptyMessage: (_branch) => "Tidak ada data status Klik.",
  errorContext: "Ringkasan Status Klik",
  return404IfEmpty: false,
});
