// /src/pages/api/informasi-promosi/data-trend-sales.ts
import { createGetHandler } from "@/lib/handlerFactory";
import {
  InformasiPromosiFilters,
  InformasiPromosiSchema,
} from "@/schema/store/informasiPromosiSchema";
import { QueryParam } from "@/types/queryParams";
import { QueryTrendSales } from "@/utils/query/queryTrendSales";

const buildFilters = (filters: InformasiPromosiFilters) => {
  const conditions: string[] = [];
  const params: QueryParam[] = [];

  if (filters.prdcd) {
    conditions.push(`sls_prdcd = $${params.length + 1}`);
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
        select * from (${QueryTrendSales(plu)}) as trend
        ${conditions}
    `;
};

export default createGetHandler({
  schema: InformasiPromosiSchema,
  buildFilters,
  buildQuery,
  successMessage: "Data trend sales berhasil diambil.",
  emptyMessage: (branch) =>
    `Tidak ada data trend sales untuk branch '${branch}'.`,
  errorContext: " api informasi harian data trend sales ",
});
