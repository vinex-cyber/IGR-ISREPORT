// src/pages/api/informasi-promosi/data-pembelian.ts
import { createGetHandler } from "@/lib/handlerFactory";
import {
  InformasiPromosiFilters,
  InformasiPromosiSchema,
} from "@/schema/store/informasiPromosiSchema";
import { QueryParam } from "@/types/queryParams";
import { QueryPembelian } from "@/utils/query/queryPembelian";

const buildFilters = (filters: InformasiPromosiFilters) => {
  const conditions: string[] = [];
  const params: QueryParam[] = [];

  if (filters.prdcd) {
    conditions.push(`pbd_prdcd = $${params.length + 1}`);
    params.push(filters.prdcd);
  }

  return {
    conditions:
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "",
    params,
  };
};

const buildQuery = (conditions: string) => {
  return `${QueryPembelian} ${conditions} ORDER BY pbh_tglpb DESC LIMIT 100`;
};

export default createGetHandler({
  schema: InformasiPromosiSchema,
  buildFilters,
  buildQuery,
  successMessage: (branch) =>
    `Data pembelian berhasil diambil untuk branch '${branch}'.`,
  emptyMessage: (branch) =>
    `Tidak ada data pembelian untuk branch '${branch}'.`,
  errorContext: "Data pembelian error",
});
