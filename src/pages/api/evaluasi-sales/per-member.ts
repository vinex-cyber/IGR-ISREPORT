// /src/pages/api/evaluasi-sales/per-member.ts
import { FilterDetailStruk } from "@/utils/filters/FiltersDetailStruk"; // pastikan import benar
import { FilterDetailStrukSchema } from "@/schema/filterDetailStruk"; // pastikan import benar
import { DetailStruk } from "@/utils/query/detailStruk";
import { createSimpleGetHandler } from "@/lib/handlerFactory";
import { QueryParam } from "@/types/queryParams";

const buildQuery = (conditions: string, params: QueryParam[]) => `
        SELECT
            dtl_outlet as outlet,
            dtl_suboutlet as suboutlet,
            dtl_cusno as kd_member,
            dtl_namamember as nama_member,
            count(distinct dtl_struk) as jumlah_struk,
            count(distinct dtl_prdcd_ctn) as jumlah_produk,
            sum(dtl_qty_pcs) as total_qty,
            sum(dtl_gross) as total_gross,
            sum(dtl_netto) as total_netto,
            sum(dtl_margin) as total_margin,
            to_char(dtl_tglmulai, 'dd-MM-yyyy') as tgl_mulai,
            to_char(dtl_tglakhir, 'dd-MM-yyyy') as tgl_akhir,
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
            dtl_outlet,
            dtl_suboutlet,
            dtl_cusno,
            dtl_namamember,
            dtl_tglmulai,
            dtl_tglakhir,
            dtl_memberkhusus
        HAVING coalesce(sum(dtl_netto),0) <> 0
        ORDER BY dtl_outlet desc, dtl_suboutlet, dtl_cusno
        `;

export default createSimpleGetHandler({
  schema: FilterDetailStrukSchema,
  buildFilters: FilterDetailStruk,
  buildQuery,
  // Kedua pesan menggunakan fungsi untuk interpolasi branch
  successMessage: (branch) =>
    `Data evaluasi sales Per Member branch '${branch}' berhasil diambil.`,
  emptyMessage: (branch) =>
    `Tidak ada data evaluasi sales Per Member untuk branch '${branch}'.`,
  errorContext: "Evaluasi Sales Per Member",
  // Return 404 jika tidak ada data
  return404IfEmpty: true,
});

//   emptyMessage: (branch) =>
//     `Tidak ada data evaluasi sales Per Member untuk branch '${branch}'.`,

//   errorContext: "Evaluasi Sales Per Member",

//   // Return 404 jika tidak ada data
//   return404IfEmpty: true,
// });
