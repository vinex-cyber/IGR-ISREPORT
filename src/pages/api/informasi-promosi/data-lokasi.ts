// src/pages/api/informasi-promosi/data-lokasi.ts
import { createGetHandler } from "@/lib/handlerFactory";
import {
  InformasiPromosiFilters,
  InformasiPromosiSchema,
} from "@/schema/store/informasiPromosiSchema";
import { QueryParam } from "@/types/queryParams";
import { QueryLokasi } from "@/utils/query/queryLokasi";

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

const buildQuery = (conditions: string) => {
  return `${QueryLokasi} ${conditions}
    ORDER BY lks_lokasi, lks_koderak, lks_kodesubrak, lks_tiperak, lks_shelvingrak, lks_nourut`;
};

export default createGetHandler({
  schema: InformasiPromosiSchema,
  buildFilters,
  buildQuery,
  successMessage: (branch) =>
    `Data lokasi berhasil diambil untuk branch '${branch}'.`,
  emptyMessage: (branch) => `Tidak ada data lokasi untuk branch '${branch}'.`,
  errorContext: "Data lokasi error",
});
