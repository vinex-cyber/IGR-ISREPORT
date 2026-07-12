// /src/pages/api/informasi-promosi/data-promo-cashback.ts
import { createGetHandler } from "@/lib/handlerFactory";
import {
  InformasiPromosiFilters,
  InformasiPromosiSchema,
} from "@/schema/store/informasiPromosiSchema";
import { QueryParam } from "@/types/queryParams";
import { QueryPromoCashback } from "@/utils/query/queryPromoCashback";

const buildFilters = (filters: InformasiPromosiFilters) => {
  const conditions: string[] = [];
  const params: QueryParam[] = [];

  if (filters.prdcd) {
    conditions.push(`prd_prdcd = $${params.length + 1}`);
    params.push(filters.prdcd);
  }

  return {
    conditions:
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "",
    params,
  };
};
const buildQuery = (conditions: string) => `
    select * from (${QueryPromoCashback(conditions)}) as cashback
    `;

export default createGetHandler({
  schema: InformasiPromosiSchema,
  buildFilters,
  buildQuery,
  successMessage: (branch) =>
    `Data cashback berhasil diambil untuk branch '${branch}'.`,
  emptyMessage: (branch) => `Tidak ada data cashback untuk branch '${branch}'.`,
  errorContext: "Data cashback",
});
