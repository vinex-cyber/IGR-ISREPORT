// src/pages/api/informasi-promosi/data-so-ic.ts
import { createGetHandler } from "@/lib/handlerFactory";
import {
  InformasiPromosiFilters,
  InformasiPromosiSchema,
} from "@/schema/store/informasiPromosiSchema";
import { QueryParam } from "@/types/queryParams";
import { QuerySoIc } from "@/utils/query/querySoIc";

const buildFilters = (filters: InformasiPromosiFilters) => {
  const conditions: string[] = [];
  const params: QueryParam[] = [];

  if (filters.prdcd) {
    conditions.push(`soic.rso_prdcd = $${params.length + 1}`);
    params.push(filters.prdcd);
  }

  return {
    conditions:
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "",
    params,
  };
};

const buildQuery = (conditions: string) => {
  return `${QuerySoIc} ${conditions} ORDER BY rso_tglso DESC, prd_prdcd`;
};

export default createGetHandler({
  schema: InformasiPromosiSchema,
  buildFilters,
  buildQuery,
  successMessage: (branch) =>
    `Data so ic berhasil diambil untuk branch '${branch}'.`,
  emptyMessage: (branch) =>
    `Tidak ada data so ic untuk branch '${branch}'.`,
  errorContext: "Data so ic error",
});
