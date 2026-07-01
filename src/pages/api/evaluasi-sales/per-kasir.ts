// /src/pages/api/evaluasi-sales/per-kasir.ts
import { FilterDetailStruk } from "@/utils/filters/FiltersDetailStruk"; // pastikan import benar
import { FilterDetailStrukSchema } from "@/schema/filterDetailStruk"; // pastikan import benar
import { DetailStruk } from "@/utils/query/detailStruk";
import { QueryParam } from "@/types/queryParams";
import { createSimpleGetHandler } from "@/lib/handlerFactory";

const buildQuery = (conditions: string, params: QueryParam[]) => `
        SELECT
            dtl_stat as station,
            dtl_kasir as kasir,
            username as nama_kasir,
            count(distinct dtl_struk) as jumlah_struk,
            count(distinct dtl_cusno) as jumlah_member,
            count(distinct dtl_prdcd_ctn) as jumlah_produk,
            sum(dtl_qty_pcs) as total_qty,
            sum(dtl_gross) as total_gross,
            sum(dtl_netto) as total_netto,
            sum(dtl_margin) as total_margin
        FROM
            (${DetailStruk(conditions, params)}) as dtl
        left join tbmaster_user as usr on dtl.dtl_kasir = usr.userid
        GROUP BY 
            dtl_stat,
            dtl_kasir,
            username
        HAVING count(dtl_netto) > 0
        ORDER BY dtl_stat, dtl_kasir
        `;
export default createSimpleGetHandler({
  schema: FilterDetailStrukSchema,
  buildFilters: FilterDetailStruk,
  buildQuery,
  successMessage: (branch) =>
    `Data evaluasi sales Per Kasir branch '${branch}' berhasil diambil.`,
  errorContext: "Evaluasi Sales Per Kasir",
  emptyMessage: (branch) =>
    `Tidak ada data evaluasi sales Per Kasir untuk branch '${branch}'.`,
  return404IfEmpty: true,
});
