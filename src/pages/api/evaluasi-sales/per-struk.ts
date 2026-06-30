// /src/pages/api/evaluasi-sales/per-struk.ts
import { FilterDetailStruk } from "@/utils/filters/FiltersDetailStruk"; // pastikan import benar
import { FilterDetailStrukSchema } from "@/schema/filterDetailStruk"; // pastikan import benar
import { DetailStruk } from "@/utils/query/detailStruk";
import { QueryParam } from "@/types/queryParams";
import { createPaginatedGetHandler } from "@/lib/handlerFactory";

const buildQuery = (conditions: string, params: QueryParam[]) => `
SELECT
            to_char(dtl_tanggal, 'dd-MM-yyyy') as tanggal,
            dtl_struk as struk,
            dtl_stat as station,
            dtl_kasir as kasir,
            dtl_cusno as kd_member,
            dtl_namamember as nama_member,
            count(distinct dtl_prdcd_ctn) as jumlah_produk,
            sum(dtl_qty_pcs) as total_qty,
            sum(dtl_gross) as total_gross,
            sum(dtl_netto) as total_netto,
            sum(dtl_margin) as total_margin,
            dtl_method as metode_pembayaran,
            case
                  when dtl_outlet = '0' then 'KARYAWAN'
                  when dtl_outlet = '6' then 'BIRU'
                  when dtl_outlet = '6' and dtl_suboutlet = '6' and dtl_cusno = 'KLE84Y' then 'FREE PASS'
                  when dtl_outlet <> '6' or dtl_outlet <> '0' and coalesce(dtl_memberkhusus,'N') = 'Y' then 'MERAH'
                  else 'OTHER'
            end as jenis_member
        FROM
            (${DetailStruk(conditions, params)}) as dtl
        GROUP BY 
            to_char(dtl_tanggal, 'dd-MM-yyyy'),
            to_char(dtl_tanggal, 'yyyymmdd'),
            dtl_struk,
            dtl_stat,
            dtl_kasir,
            dtl_method,
            dtl_outlet,
            dtl_suboutlet,
            dtl_cusno,
            dtl_namamember,
            dtl_memberkhusus
        HAVING count(dtl_netto) > 0
        ORDER BY to_char(dtl_tanggal, 'yyyymmdd'), dtl_struk, dtl_stat, dtl_kasir

`;

// ============================================================
// Handler
// ============================================================

export default createPaginatedGetHandler({
  schema: FilterDetailStrukSchema,
  buildFilters: FilterDetailStruk,
  buildQuery,
  successMessage: (branch) =>
    `Data evaluasi sales per produk branch '${branch}' berhasil diambil.`,
  errorContext: "Evaluasi Sales Per Produk",
  emptyMessage: (branch) =>
    `Tidak ada data evaluasi sales per produk untuk branch '${branch}'.`,
});
