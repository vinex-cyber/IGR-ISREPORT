// /src/pages/api/evaluasi-sales/per-supplier.ts
import { FilterDetailStruk } from "@/utils/filters/FiltersDetailStruk"; // pastikan import benar
import { FilterDetailStrukSchema } from "@/schema/filterDetailStruk"; // pastikan import benar
import { DetailStruk } from "@/utils/query/detailStruk";
import { QueryParam } from "@/types/queryParams";
import { createSimpleGetHandler } from "@/lib/handlerFactory";

const buildQuery = (conditions: string, params: QueryParam[]) => `
        SELECT
            dtl_kodesupplier as kode_supplier,
            dtl_namasupplier as nama_supplier,
            count(distinct dtl_cusno) as jumlah_member,
            count(distinct dtl_struk) as jumlah_struk,
            count(distinct dtl_prdcd_ctn) as jumlah_produk,
            sum(dtl_qty_pcs) as total_qty,
            sum(dtl_gross) as total_gross,
            sum(dtl_netto) as total_netto,
            sum(dtl_margin) as total_margin
        FROM
            (${DetailStruk(conditions, params)}) as dtl
        GROUP BY 
            dtl_kodesupplier,
            dtl_namasupplier
        HAVING count(dtl_netto) > 0
        ORDER BY total_margin DESC
        `;
export default createSimpleGetHandler({
  schema: FilterDetailStrukSchema,
  buildFilters: FilterDetailStruk,
  buildQuery,
  successMessage: (branch) =>
    `Data evaluasi sales Per Supplier branch '${branch}' berhasil diambil.`,
  errorContext: "Evaluasi Sales Per Supplier",
  emptyMessage: (branch) =>
    `Tidak ada data evaluasi sales Per Supplier untuk branch '${branch}'.`,
});
