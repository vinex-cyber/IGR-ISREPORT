// src/pages/api/informasi-promosi/data-riwayat-pembelian.ts
import { createGetHandler } from "@/lib/handlerFactory";
import {
  InformasiPromosiFilters,
  InformasiPromosiSchema,
} from "@/schema/store/informasiPromosiSchema";
import { QueryParam } from "@/types/queryParams";
import { QueryRiwayatPembelian } from "@/utils/query/queryRiwayatPembelian";

const buildFilters = (filters: InformasiPromosiFilters) => {
  const conditions: string[] = [];
  const params: QueryParam[] = [];

  if (filters.prdcd) {
    conditions.push(`AND m.mstd_prdcd = $${params.length + 1}`);
    params.push(filters.prdcd);
  }

  return {
    conditions: conditions.length > 0 ? conditions.join(" AND ") : "",
    params,
  };
};

const buildQuery = (conditions: string) => QueryRiwayatPembelian(conditions);

export default createGetHandler({
  schema: InformasiPromosiSchema,
  buildFilters,
  buildQuery,
  successMessage: (branch) =>
    `Data riwayat pembelian berhasil diambil untuk branch '${branch}'.`,
  emptyMessage: (branch) =>
    `Tidak ada data riwayat pembelian untuk branch '${branch}'.`,
  errorContext: "Data riwayat pembelian error",
});
