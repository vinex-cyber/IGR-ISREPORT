// /src/pages/api/evaluasi-sales/per-bulan.ts
import { FilterDetailStruk } from "@/utils/filters/FiltersDetailStruk"; // pastikan import benar
import { FilterDetailStrukSchema } from "@/schema/filterDetailStruk"; // pastikan import benar
import { DetailStruk } from "@/utils/query/detailStruk";
import { createGetHandler } from "@/lib/handlerFactory";
import { QueryParam } from "@/types/queryParams";

const buildQuery = (conditions: string, params: QueryParam[]) => `
        SELECT
            to_char(dtl_tanggal, 'MM-yyyy') as bulan,
            to_char(dtl_tanggal, 'Month YYYY') as nama_bulan,
            count(distinct dtl_cusno) as jumlah_member,
            count(distinct dtl_struk) as jumlah_struk,
            count(distinct dtl_prdcd_ctn) as jumlah_produk,
            sum(dtl_qty_pcs) as total_qty,
            sum(dtl_gross) as total_gross,
            sum(dtl_netto) as total_netto,
            sum(dtl_margin) as total_margin
        FROM
            (${DetailStruk(conditions, params)}) as dtl
        GROUP BY to_char(dtl_tanggal, 'yyyymm'), to_char(dtl_tanggal, 'MM-yyyy'), to_char(dtl_tanggal, 'Month YYYY')
        having coalesce(SUM(dtl_netto),0) <> 0
        ORDER BY to_char(dtl_tanggal, 'yyyymm')
        `;

export default createGetHandler({
  schema: FilterDetailStrukSchema,
  buildFilters: FilterDetailStruk,
  buildQuery,
  emptyMessage: (branch) =>
    `Tidak ada data evaluasi sales per bulan untuk branch '${branch}'.`,
  successMessage: (branch) =>
    `Data evaluasi sales per bulan branch '${branch}' berhasil diambil.`,
  errorContext: "Evaluasi Sales Per Bulan",
  return404IfEmpty: true,
});
