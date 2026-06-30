// /src/pages/api/inventory/lpp-saat-ini/per-divisi.ts
import { FilterLppSaatIniSchema } from "@/schema/filterLppSaatIni";
import { buildFilterLppSaatIni } from "@/utils/filters/FilterLppSaatIni";
import { QueryLppSaatIni } from "@/utils/query/queryLppSaatIni";
import { createSimpleGetHandler } from "@/lib/handlerFactory";

// ============================================================
// Query Builder
// ============================================================
const buildQuery = (conditions: string) => `
  SELECT
    st_div,
    st_div_nama,
    COUNT(st_prdcd)                AS st_item_produk,
    SUM(st_saldo_in_pcs)           AS st_saldo_in_pcs,
    SUM(st_saldo_rph)              AS st_saldo_rph,
    SUM(st_saldo_rph_lastcost)     AS st_saldo_rph_lastcost,
    COUNT(DISTINCT st_supp_kode)   AS st_supp_jumlah
  FROM (${QueryLppSaatIni({ conditions })}) as lpp
  GROUP BY st_div, st_div_nama
  HAVING COALESCE(SUM(st_saldo_in_pcs), 0) <> 0
  ORDER BY st_div
`;
// ============================================================
// Handler
// ============================================================
export default createSimpleGetHandler({
  schema: FilterLppSaatIniSchema,
  buildFilters: buildFilterLppSaatIni,
  buildQuery,

  // Kedua pesan menggunakan fungsi untuk interpolasi branch
  successMessage: (branch) =>
    `Data Data LPP Saat ini per divisi branch '${branch}' berhasil diambil.`,
  emptyMessage: (branch) =>
    `Tidak ada data Data LPP Saat ini per divisi untuk branch '${branch}'.`,

  errorContext: "Evaluasi Sales Per Divisi",

  // Return 404 jika tidak ada data
  return404IfEmpty: true,
});
