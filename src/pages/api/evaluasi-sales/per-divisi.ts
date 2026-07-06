// /src/pages/api/evaluasi-sales/per-divisi.ts
import { createGetHandler } from "@/lib/handlerFactory";
import { FilterDetailStrukSchema } from "@/schema/filterDetailStruk";
import { FilterDetailStruk } from "@/utils/filters/FiltersDetailStruk";
import { DetailStruk } from "@/utils/query/detailStruk";
import type { QueryParam } from "@/types/queryParams";

const buildQuery = (conditions: string, params: QueryParam[]) => `
  SELECT
    dtl_k_div                        AS div,
    dtl_nama_div                     AS nama_div,
    COUNT(DISTINCT dtl_cusno)        AS jumlah_member,
    COUNT(DISTINCT dtl_struk)        AS jumlah_struk,
    COUNT(DISTINCT dtl_prdcd_ctn)    AS jumlah_produk,
    sum(dtl_qty_pcs)                 AS total_qty,
    sum(dtl_gross)                   AS total_gross,
    SUM(dtl_netto)                   AS total_netto,
    sum(dtl_margin)                  AS total_margin
  FROM (${DetailStruk(conditions, params)}) AS dtl
  GROUP BY dtl_k_div, dtl_nama_div
  HAVING COALESCE(SUM(dtl_netto), 0) <> 0
  ORDER BY dtl_k_div
`;

export default createGetHandler({
  schema: FilterDetailStrukSchema,
  buildFilters: FilterDetailStruk,
  buildQuery,

  // Kedua pesan menggunakan fungsi untuk interpolasi branch
  successMessage: (branch) =>
    `Data evaluasi sales per divisi branch '${branch}' berhasil diambil.`,
  emptyMessage: (branch) =>
    `Tidak ada data evaluasi sales per divisi untuk branch '${branch}'.`,

  errorContext: "Evaluasi Sales Per Divisi",

  // Return 404 jika tidak ada data
  return404IfEmpty: true,
});
