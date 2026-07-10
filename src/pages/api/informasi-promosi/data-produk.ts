// /src/pages/api/informasi-harian/data-produk.ts
import { createGetHandler } from "@/lib/handlerFactory";
import {
  InformasiPromosiFilters,
  InformasiPromosiSchema,
} from "@/schema/store/informasiPromosiSchema";
import { QueryParam } from "@/types/queryParams";
import { QueryAvgSalesBulanan } from "@/utils/query/queryAvgSalesBulanan";
import { QueryGroupFlag } from "@/utils/query/queryGroupFlag";
import { QueryPbOut } from "@/utils/query/queryPbOut";

const buildFilters = (filters: InformasiPromosiFilters) => {
  const conditions: string[] = [];
  const params: QueryParam[] = [];

  if (filters.prdcd) {
    conditions.push(`prd.prd_prdcd = $${params.length + 1}`);
    params.push(filters.prdcd);
  }

  return {
    conditions:
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "",
    params,
  };
};

const buildQuery = (conditions: string, params: QueryParam[]) => {
  const plu = params.length > 0 ? String(params[0]) : undefined;

  return `
    SELECT prd_kodedivisi,
           div_namadivisi,
           prd_kodedepartement,
           dep_namadepartement,
           prd_kodekategoribarang,
           kat_namakategori,
           prd_prdcd,
           prd_plumcg,
           prc_pluomi,
           prd_deskripsipendek,
           prd_deskripsipanjang,
           prd_unit,
           prd_frac,
           prd_avgcost,
           prd_flagbkp1,
           prd.prd_flagidm,
           prd_kodecabang,
           prd_kategoritoko,
           prd_modify_by,
           prd_modify_dt,
           s.st_saldoakhir AS prd_stock,
           flag,
           avg_sales,
           pb_out
    FROM   tbmaster_prodmast prd
           LEFT JOIN tbmaster_divisi      ON prd.prd_kodedivisi = div_kodedivisi
           LEFT JOIN tbmaster_departement ON prd.prd_kodedepartement = dep_kodedepartement
           LEFT JOIN tbmaster_kategori    ON prd.prd_kodedepartement = kat_kodedepartement
                                         AND prd.prd_kodekategoribarang = kat_kodekategori
           LEFT JOIN tbmaster_prodcrm     ON prd.prd_prdcd = prc_pluigr
           LEFT JOIN (SELECT st_prdcd, COALESCE(st_saldoakhir,0) AS st_saldoakhir
                      FROM tbmaster_stock WHERE st_lokasi = '01') s
                                         ON prd.prd_prdcd = s.st_prdcd
           LEFT JOIN ( ${QueryGroupFlag(plu)} ) sii  ON prd.prd_prdcd = sii.plu
           LEFT JOIN ( ${QueryAvgSalesBulanan(plu)} ) rsl ON prd.prd_prdcd = rsl.rsl_prdcd
           LEFT JOIN ( ${QueryPbOut(plu)} ) pbout ON prd.prd_prdcd = pbout.plu_pbout
    ${conditions}
  `;
};

export default createGetHandler({
  schema: InformasiPromosiSchema,
  buildFilters,
  buildQuery,
  successMessage: "Data produk berhasil diambil.",
  emptyMessage: (branch) => `Tidak ada data produk untuk branch '${branch}'.`,
  errorContext: " api informasi harian data produk ",
});
