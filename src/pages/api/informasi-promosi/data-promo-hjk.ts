// src/pages/api/informasi-promosi/data-promo-hjk.ts
import { createGetHandler } from "@/lib/handlerFactory";
import {
  InformasiPromosiFilters,
  InformasiPromosiSchema,
} from "@/schema/store/informasiPromosiSchema";
import { QueryParam } from "@/types/queryParams";
import { QueryPromoHjk } from "@/utils/query/queryPromoHjk";

const buildFilters = (filters: InformasiPromosiFilters) => {
  const conditions: string[] = [];
  const params: QueryParam[] = [];

  if (filters.prdcd) {
    conditions.push(`hgk_prdcd = $${params.length + 1}`);
    params.push(filters.prdcd);
  }

  return {
    conditions: conditions.length > 0 ? `AND ${conditions.join(" AND ")}` : "",
    params,
  };
};

const buildQuery = (conditions: string) => {
  return `select * from (${QueryPromoHjk(conditions)}) as hjk`;
};

export default createGetHandler({
  schema: InformasiPromosiSchema,
  buildFilters,
  buildQuery,
  successMessage: (branch) =>
    `Data HJK berhasil diambil untuk branch '${branch}'.`,
  errorContext: "Data HJK error",
  emptyMessage: (branch) => `Tidak ada data HJK untuk branch '${branch}'.`,
});
