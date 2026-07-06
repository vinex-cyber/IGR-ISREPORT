import { createGetHandler } from "@/lib/handlerFactory";
import {
  MasterLokasiSchema,
  type MasterLokasiFilters,
} from "@/schema/inventory/master-lokasi/masterLokasiSchema";
import { MasterLokasiQuery } from "@/utils/query/inventory/master-lokasi-query";

/**
 * =========================================
 * 🔌 API ROUTE: Master - lokasi
 * =========================================
 *
 * 📍 Endpoint: /api/inventory/master-lokasi/index
 * 📄 File: src/pages/api/inventory/master-lokasi/index.ts
 *
 * 📌 Jenis: Simple (list — all data)
 * 📐 Schema: Terpisah (src/schema/inventory/master-lokasi/masterLokasiSchema)
 */

// ============================================================
// Filter Builder
// ============================================================
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function buildFilters(filters: MasterLokasiFilters) {
  return { conditions: "1 = 1", params: [] };
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
export default createGetHandler<MasterLokasiFilters>({
  schema: MasterLokasiSchema,
  buildFilters,
  buildQuery,
  successMessage: "Data Master Lokasi berhasil diambil.",
  emptyMessage: (branch) => `Tidak ada data untuk branch '${branch}'.`,
  errorContext: "Error saat mengambil data Master Lokasi.",
});
