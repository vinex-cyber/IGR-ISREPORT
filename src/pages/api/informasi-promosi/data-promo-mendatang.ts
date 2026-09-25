// /src/pages/api/informasi-promosi/data-promo-cashback.ts
import { createGetHandler } from "@/lib/handlerFactory";
import {
  InformasiPromosiFilters,
  InformasiPromosiSchema,
} from "@/schema/store/informasiPromosiSchema";
import { QueryParam } from "@/types/queryParams";
import { QueryPromoMendatang } from "@/utils/query/queryPromoMendatang";

const buildFilters = (filters: InformasiPromosiFilters) => {
  const conditions: string[] = [];
  const params: QueryParam[] = [];

  if (filters.prdcd) {
    conditions.push(`plu_promo = $${params.length + 1}`);
    params.push(filters.prdcd);
  }

  return {
    conditions:
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "",
    params,
  };
};
const buildQuery = (conditions: string) => `
    select * from (${QueryPromoMendatang(conditions)}) as mendatang
    `;

export default createGetHandler({
  schema: InformasiPromosiSchema,
  buildFilters,
  buildQuery,
  successMessage: (branch) =>
    `Data promo mendatang berhasil diambil untuk branch '${branch}'.`,
  emptyMessage: (branch) =>
    `Tidak ada data promo mendatang untuk branch '${branch}'.`,
  errorContext: "Data promo mendatang",
});
