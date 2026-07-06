// /src/pages/api/evaluasi-sales/per-produk.ts
import { createSimpleGetHandler } from "@/lib/handlerFactory"; // Sesuaikan path
import { FilterDetailStrukSchema } from "@/schema/filterDetailStruk";
import { FilterDetailStruk } from "@/utils/filters/FiltersDetailStruk";
import { DetailStruk } from "@/utils/query/detailStruk";
import type { QueryParam } from "@/types/queryParams";

const buildQuery = (conditions: string, params: QueryParam[]) => `
    SELECT
        dtl_k_div               AS div,
        dtl_k_dept              AS dept,
        dtl_k_katb              AS kategori,
        dtl_prdcd_ctn           AS plu,
        dtl_nama_barang         AS nama_produk,
        COUNT(DISTINCT dtl_cusno)   AS jumlah_member,
        COUNT(DISTINCT dtl_struk)   AS jumlah_struk,
        SUM(dtl_qty_pcs)            AS total_qty,
        SUM(dtl_gross)              AS total_gross,
        SUM(dtl_netto)              AS total_netto,
        SUM(dtl_margin)             AS total_margin
    FROM
        (${DetailStruk(conditions, params)}) AS dtl
    GROUP BY
        dtl_k_div,
        dtl_k_dept,
        dtl_k_katb,
        dtl_prdcd_ctn,
        dtl_nama_barang
    HAVING COUNT(dtl_netto) > 0
    ORDER BY total_margin DESC
`;

export default createSimpleGetHandler({
  schema: FilterDetailStrukSchema,
  buildFilters: FilterDetailStruk,
  buildQuery,
  successMessage: (branch) =>
    `Data evaluasi sales per produk branch '${branch}' berhasil diambil.`,
  errorContext: "Evaluasi Sales Per Produk",
  emptyMessage: (branch) =>
    `Tidak ada data evaluasi sales per produk untuk branch '${branch}'.`,
});

//   emptyMessage: (branch) =>
//     `Tidak ada data evaluasi sales per produk untuk branch '${branch}'.`,
// });
