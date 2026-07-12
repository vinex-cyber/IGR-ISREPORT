// src/pages/api/informasi-promosi/data-promo-instore.ts
import { createGetHandler } from "@/lib/handlerFactory";
import {
  InformasiPromosiFilters,
  InformasiPromosiSchema,
} from "@/schema/store/informasiPromosiSchema";
import { QueryParam } from "@/types/queryParams";
import { QueryPromoInstore } from "@/utils/query/queryPromoInstore";

const buildFilters = (filters: InformasiPromosiFilters) => {
  const conditions: string[] = [];
  const params: QueryParam[] = [];

  if (filters.prdcd) {
    conditions.push(`isd_prdcd = $${params.length + 1}`);
    params.push(filters.prdcd);
  }

  return {
    conditions: conditions.length > 0 ? `AND ${conditions.join(" AND ")}` : "",
    params,
  };
};

const buildQuery = (conditions: string) => {
  return `select * from (${QueryPromoInstore(conditions)}) as instore`;
};

export default createGetHandler({
  schema: InformasiPromosiSchema,
  buildFilters,
  buildQuery,
  successMessage: (branch) =>
    `Data instore berhasil diambil untuk branch '${branch}'.`,
  errorContext: "Data instore error",
  emptyMessage: (branch) => `Tidak ada data instore untuk branch '${branch}'.`,
});
