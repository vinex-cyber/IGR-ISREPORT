// /src/pages/api/chart/trend-sales-divisi/index.ts
import { createGetHandler } from "@/lib/handlerFactory";
import {
  TrendSalesDivisiFilters,
  TrendSalesDivisiSchema,
} from "@/schema/store/informasiPromosiSchema";
import { QueryParam } from "@/types/queryParams";
import { QueryTrendSalesByDivisi } from "@/utils/query/queryTrendSalesByDivisi";

const buildFilters = (filters: TrendSalesDivisiFilters) => {
  const conditions: string[] = [];
  const params: QueryParam[] = [];

  if (filters.divisi) {
    conditions.push(`p.prd_kodedivisi = $${params.length + 1}`);
    params.push(filters.divisi);
  }

  return {
    conditions:
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "",
    params,
  };
};

const buildQuery = (conditions: string) => {
  return `
    ${QueryTrendSalesByDivisi()}
    ${conditions}
  `;
};

export default createGetHandler({
  schema: TrendSalesDivisiSchema,
  buildFilters,
  buildQuery,
  successMessage: "Data trend sales per divisi berhasil diambil.",
  emptyMessage: (branch) =>
    `Tidak ada data trend sales per divisi untuk branch '${branch}'.`,
  errorContext: " api informasi promosi trend sales per divisi ",
});
