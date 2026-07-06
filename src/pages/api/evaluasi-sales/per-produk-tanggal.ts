// /src/pages/api/evaluasi-sales/per-produk-tanggal.ts
import { FilterDetailStruk } from "@/utils/filters/FiltersDetailStruk"; // pastikan import benar
import { FilterDetailStrukSchema } from "@/schema/filterDetailStruk"; // pastikan import benar
import { DetailStruk } from "@/utils/query/detailStruk";
import { QueryParam } from "@/types/queryParams";
import { createGetHandler } from "@/lib/handlerFactory";

const buildQuery = (conditions: string, params: QueryParam[]) => `
        SELECT
        to_char(dtl_tanggal, 'dd-MM-yyyy') as tanggal,
            dtl_k_div as div,
            dtl_k_dept as dept,
            dtl_k_katb as kategori,
            dtl_prdcd_ctn as plu,
            dtl_nama_barang as nama_produk,
            count(distinct dtl_cusno) as jumlah_member,
            count(distinct dtl_struk) as jumlah_struk,
            sum(dtl_qty_pcs) as total_qty,
            sum(dtl_gross) as total_gross,
            sum(dtl_netto) as total_netto,
            sum(dtl_margin) as total_margin
        FROM
            (${DetailStruk(conditions, params)}) as dtl
        GROUP BY dtl_k_div, dtl_k_dept, dtl_k_katb, dtl_prdcd_ctn, dtl_nama_barang, to_char(dtl_tanggal, 'dd-MM-yyyy'),to_char(dtl_tanggal, 'yyyymmdd')
        HAVING count(dtl_netto) > 0
        ORDER BY to_char(dtl_tanggal, 'yyyymmdd'),dtl_k_div, dtl_k_dept, dtl_k_katb, dtl_prdcd_ctn
        `;
export default createGetHandler({
  schema: FilterDetailStrukSchema,
  buildFilters: FilterDetailStruk,
  buildQuery,
  successMessage: (branch) =>
    `Data evaluasi sales per produk branch '${branch}' berhasil diambil.`,
  errorContext: "Evaluasi Sales Per Produk",
  emptyMessage: (branch) =>
    `Tidak ada data evaluasi sales per produk untuk branch '${branch}'.`,
  return404IfEmpty: true,
});
