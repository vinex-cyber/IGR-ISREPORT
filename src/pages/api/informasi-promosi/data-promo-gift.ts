// /src/pages/api/informasi-promosi/data-promo-gift.ts
import { createGetHandler } from "@/lib/handlerFactory";
import {
  InformasiPromosiFilters,
  InformasiPromosiSchema,
} from "@/schema/store/informasiPromosiSchema";
import { QueryParam } from "@/types/queryParams";
import { QueryPromoGift } from "@/utils/query/queryPromoGift";

const buildFilters = (filters: InformasiPromosiFilters) => {
  const conditions: string[] = [];
  const params: QueryParam[] = [];

  if (filters.prdcd) {
    conditions.push(`d.gfd_prdcd = $${params.length + 1}`);
    params.push(filters.prdcd);
  }

  return {
    conditions: conditions.length > 0 ? `AND ${conditions.join(" AND ")}` : "",
    params,
  };
};
const buildQuery = (conditions: string) => {
  return `
        select * from (${QueryPromoGift(conditions)}) as gift
    `;
};
export default createGetHandler({
  schema: InformasiPromosiSchema,
  buildFilters,
  buildQuery,
  successMessage: (branch) =>
    `Data gift berhasil diambil untuk branch '${branch}'.`,
  errorContext: "Data gift error",
  emptyMessage: (branch) => `Tidak ada data gift untuk branch '${branch}'.`,
});
