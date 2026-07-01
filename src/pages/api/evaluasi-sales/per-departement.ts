// /src/pages/api/evaluasi-sales/per-departement.ts
import { createSimpleGetHandler } from "@/lib/handlerFactory";
import { FilterDetailStrukSchema } from "@/schema/filterDetailStruk";
import { FilterDetailStruk } from "@/utils/filters/FiltersDetailStruk";
import { DetailStruk } from "@/utils/query/detailStruk";
import type { QueryParam } from "@/types/queryParams";

// ============================================================
// Query Builder
// ============================================================
const buildQuery = (conditions: string, params: QueryParam[]) => `
          SELECT
            dtl_k_div as div,
            dtl_k_dept as dept,
            dtl_nama_dept as nama_dept,
            count(distinct dtl_cusno) as jumlah_member,
            count(distinct dtl_struk) as jumlah_struk,
            count(distinct dtl_prdcd_ctn) as jumlah_produk,
            sum(dtl_qty_pcs) as total_qty,
            sum(dtl_gross) as total_gross,
            sum(dtl_netto) as total_netto,
            sum(dtl_margin) as total_margin
        FROM
            (${DetailStruk(conditions, params)}) as dtl
        GROUP BY dtl_k_div, dtl_k_dept, dtl_nama_dept
        having coalesce(SUM(dtl_netto),0) <> 0
        ORDER BY dtl_k_div, dtl_k_dept
`;
export default createSimpleGetHandler({
  schema: FilterDetailStrukSchema,
  buildFilters: FilterDetailStruk,
  buildQuery,
  // Kedua pesan menggunakan fungsi untuk interpolasi branch
  successMessage: (branch) =>
    `Data evaluasi sales per departement branch '${branch}' berhasil diambil.`,
  emptyMessage: (branch) =>
    `Tidak ada data evaluasi sales per departement untuk branch '${branch}'.`,

  errorContext: "Evaluasi Sales Per Departement",

  // Return 404 jika tidak ada data
  return404IfEmpty: true,
});
