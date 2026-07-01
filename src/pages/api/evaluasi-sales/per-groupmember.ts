// /src/pages/api/evaluasi-sales/per-groupmember.ts
import { FilterDetailStruk } from "@/utils/filters/FiltersDetailStruk"; // pastikan import benar
import { FilterDetailStrukSchema } from "@/schema/filterDetailStruk"; // pastikan import benar
import { DetailStruk } from "@/utils/query/detailStruk";
import { createSimpleGetHandler } from "@/lib/handlerFactory";
import { QueryParam } from "@/types/queryParams";

const buildQuery = (conditions: string, params: QueryParam[]) => `
        SELECT
            dtl_tipemember as tipe_member,
            dtl_outlet as outlet,
            dtl_suboutlet as suboutlet,
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
            dtl_tipemember,
            dtl_outlet,
            dtl_suboutlet
        having coalesce(SUM(dtl_netto),0) <> 0
        ORDER BY dtl_tipemember, dtl_outlet, dtl_suboutlet
        `;
export default createSimpleGetHandler({
  schema: FilterDetailStrukSchema,
  buildFilters: FilterDetailStruk,
  buildQuery,
  successMessage: (branch) =>
    `Data evaluasi sales Per Group Member branch '${branch}' berhasil diambil.`,
  errorContext: "Evaluasi Sales Per Group Member",
  return404IfEmpty: true,
  emptyMessage: (branch) =>
    `Tidak ada data evaluasi sales Per Group Member untuk branch '${branch}'.`,
});
