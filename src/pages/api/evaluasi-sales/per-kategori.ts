// /src/pages/api/evaluasi-sales/per-kategori.ts
import { FilterDetailStruk } from "@/utils/filters/FiltersDetailStruk"; // pastikan import benar
import { FilterDetailStrukSchema } from "@/schema/filterDetailStruk"; // pastikan import benar
import { DetailStruk } from "@/utils/query/detailStruk";
import { QueryParam } from "@/types/queryParams";
import { createSimpleGetHandler } from "@/lib/handlerFactory";

const buildQuery = (conditions: string, params: QueryParam[]) => `
        SELECT
            dtl_k_div as div,
            dtl_k_dept as dept,
            dtl_k_katb as kategori,
            dtl_nama_katb as nama_kategori,
            count(distinct dtl_cusno) as jumlah_member,
            count(distinct dtl_struk) as jumlah_struk,
            count(distinct dtl_prdcd_ctn) as jumlah_produk,
            sum(dtl_qty_pcs) as total_qty,
            sum(dtl_gross) as total_gross,
            sum(dtl_netto) as total_netto,
            sum(dtl_margin) as total_margin
        FROM
            (${DetailStruk(conditions, params)}) as dtl
        GROUP BY dtl_k_div, dtl_k_dept, dtl_k_katb, dtl_nama_katb
        HAVING count(dtl_netto) > 0
        ORDER BY dtl_k_div, dtl_k_dept, dtl_k_katb
        `;
export default createSimpleGetHandler({
  schema: FilterDetailStrukSchema,
  buildFilters: FilterDetailStruk,
  buildQuery,
  successMessage: (branch) =>
    `Data evaluasi sales Per Kategori branch '${branch}' berhasil diambil.`,
  errorContext: "Evaluasi Sales Per Kategori",
  emptyMessage: (branch) =>
    `Tidak ada data evaluasi sales Per Kategori untuk branch '${branch}'.`,
  return404IfEmpty: true,
});
