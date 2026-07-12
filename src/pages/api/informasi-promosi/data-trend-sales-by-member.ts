// src/pages/api/informasi-promosi/data-trend-sales-by-member.ts
import { createGetHandler } from "@/lib/handlerFactory";
import {
  InformasiPromosiFilters,
  InformasiPromosiSchema,
} from "@/schema/store/informasiPromosiSchema";
import { QueryParam } from "@/types/queryParams";
import { QueryTrendSalesByMember } from "@/utils/query/queryTrendSalesByMember";

const buildFilters = (filters: InformasiPromosiFilters) => {
  const params: QueryParam[] = [];

  if (filters.prdcd) {
    params.push(filters.prdcd);
  }

  return {
    conditions: "",
    params,
  };
};

const buildQuery = (_conditions: string, params: QueryParam[]) => {
  const plu = params.length > 0 ? String(params[0]) : undefined;
  return QueryTrendSalesByMember(plu);
};

export default createGetHandler({
  schema: InformasiPromosiSchema,
  buildFilters,
  buildQuery,
  successMessage: (branch) =>
    `Data trend sales by member berhasil diambil untuk branch '${branch}'.`,
  errorContext: "Data trend sales by member error",
  emptyMessage: (branch) =>
    `Tidak ada data trend sales untuk branch '${branch}'.`,
});
