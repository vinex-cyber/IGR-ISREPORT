// /src/pages/api/informasi-promosi/data-setting-harga.ts
import { createGetHandler } from "@/lib/handlerFactory";
import {
  InformasiPromosiFilters,
  InformasiPromosiSchema,
} from "@/schema/store/informasiPromosiSchema";
import { QueryParam } from "@/types/queryParams";

const buildFilters = (filters: InformasiPromosiFilters) => {
  const conditions: string[] = [];
  const params: QueryParam[] = [];

  if (filters.prdcd) {
    conditions.push(`prd_prdcd LIKE $${params.length + 1}`);
    params.push(`${filters.prdcd.slice(0, 6)}%`);
  }

  return {
    conditions:
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "",
    params,
  };
};

const buildQuery = (conditions: string) => {
  return `
        select 
                prd_kodedivisi,
                prd_kodedepartement,
                prd_prdcd,
                prd_deskripsipanjang,
                prd_unit,
                prd_frac,
                prd_hrgjual,
                prd_kodetag,
                prc_kodetag,
                prd_avgcost,
                prd_minjual,
                prmd_hrgjual,
                prmd_tglawal,
                prmd_tglakhir,
                prd_lastcost,
                COALESCE(prd_flagbkp1, 'T') AS prd_flagbkp1,
                COALESCE(prd_flagbkp2, 'T') AS prd_flagbkp2,
                CASE 
                    WHEN COALESCE(prd_flagbkp1, 'T') = 'Y' AND COALESCE(prd_flagbkp2, 'T') = 'Y' THEN PRD_HRGJUAL / 11.1 * 10
                    ELSE PRD_HRGJUAL
                END AS st_harga_netto,
                ROUND(CASE 
                    WHEN COALESCE(prd_flagbkp1, 'T') = 'Y' AND COALESCE(prd_flagbkp2, 'T') = 'Y' THEN prmd_hrgjual / 11.1 * 10
                    ELSE prmd_hrgjual
                END) AS st_md_netto,
                prmd_flag_pos,
                prmd_flag_klik,
                prmd_flag_spi
            from tbmaster_prodmast
      LEFT JOIN (
        SELECT 
            prmd_prdcd,
            prmd_hrgjual,
            prmd_tglawal,
            prmd_tglakhir,
            prmd_flag_pos,
            prmd_flag_klik,
            prmd_flag_spi
        FROM 
            tbtr_promomd
        WHERE 
            CURRENT_DATE BETWEEN prmd_tglawal AND prmd_tglakhir
    ) AS promomd ON tbmaster_prodmast.prd_prdcd = promomd.prmd_prdcd
    LEFT JOIN tbmaster_prodcrm ON tbmaster_prodmast.prd_prdcd = tbmaster_prodcrm.prc_pluigr
    ${conditions}
    order by prd_prdcd    
    `;
};

export default createGetHandler({
  schema: InformasiPromosiSchema,
  buildFilters,
  buildQuery,
  successMessage: (branch) =>
    `Data setting harga berhasil diambil untuk branch '${branch}'.`,
  emptyMessage: (branch) => `Tidak ada data untuk branch '${branch}'.`,
  errorContext: "api informasi-promosi data-setting-harga",
});
