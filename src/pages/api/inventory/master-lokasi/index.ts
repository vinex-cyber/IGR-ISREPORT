import { createSimpleGetHandler } from "@/lib/handlerFactory";
import {
  MasterLokasiSchema,
  type MasterLokasiFilters,
} from "@/schema/inventory/master-lokasi/masterLokasiSchema";
import type { QueryParam } from "@/types/queryParams";
import { MasterLokasiQuery } from "@/utils/query/inventory/master-lokasi-query";

/**
 * =========================================
 * 🔌 API ROUTE: Master - lokasi
 * =========================================
 *
 * 📍 Endpoint: /api/inventory/master-lokasi/index
 * 📄 File: src/pages/api/inventory/master-lokasi/index.ts
 *
 * 📌 Jenis: Paginated (list + search + pagination)
 * 📐 Schema: Terpisah (src/schema/inventory/master-lokasi/masterLokasiSchema)
 */

// ============================================================
// Filter Builder
// ============================================================
function buildFilters(filters: MasterLokasiFilters) {
  if (!filters.search) {
    return { conditions: "1 = 1", params: [] };
  }

  const keywordLike = `%${filters.search}%`;
  const conditions = `1 = 1 AND (PRD_DESKRIPSIPANJANG ILIKE $1 OR PRD_PRDCD ILIKE $1)`;
  const params: QueryParam[] = [keywordLike];

  return { conditions, params };
}

// ============================================================
// Query Builder
// ============================================================
function buildQuery(conditions: string) {
  return `select * from (${MasterLokasiQuery()}) master_lokasi WHERE ${conditions}`;
}

// ============================================================
// Handler
// ============================================================
export default createSimpleGetHandler<MasterLokasiFilters>({
  schema: MasterLokasiSchema,
  buildFilters,
  buildQuery,
  successMessage: "Data Master Lokasi berhasil diambil.",
  emptyMessage: (branch) => `Tidak ada data untuk branch '${branch}'.`,
  errorContext: "Error saat mengambil data Master Lokasi.",
});
