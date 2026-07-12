// /src/pages/api/informasi-promosi/data-cashback-jenismember.ts
import { createGetHandler } from "@/lib/handlerFactory";
import {
  InformasiPromosiFilters,
  InformasiPromosiSchema,
} from "@/schema/store/informasiPromosiSchema";
import { QueryParam } from "@/types/queryParams";
import { GetCashbackMb } from "@/utils/query/queryCashbackMb";
import { GetCashbackMm } from "@/utils/query/queryCashbackMm";
import { GetCashbackPl } from "@/utils/query/queryCashbackPl";

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
        SELECT
            plu,
            hrgmm, cbmm, hrg_netmm,
            hrgbiru, cbbiru, hrg_netbiru,
            hrgpla, cbpla, hrg_netpla
        FROM (select prd_prdcd plu FROM TBMASTER_PRODMAST ${conditions})master
        left join (${GetCashbackMm()}) cashbackMM on plu = plumm
        left join (${GetCashbackMb()}) cashbackMB on plu = plubiru
        left join (${GetCashbackPl()}) cashbackPL on plu = plupla
        `;
};

export default createGetHandler({
  schema: InformasiPromosiSchema,
  buildFilters,
  buildQuery,
  successMessage: (branch) =>
    `Data cashback jenismember berhasil diambil untuk branch '${branch}'.`,
  emptyMessage: (branch) =>
    `Tidak ada data cashback jenismember untuk branch '${branch}'.`,
  errorContext: "Data cashback jenismember",
});
