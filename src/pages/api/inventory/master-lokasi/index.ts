import { createGetHandler } from "@/lib/handlerFactory";
import {
  MasterLokasiSchema,
  type MasterLokasiFilters,
} from "@/schema/inventory/master-lokasi/masterLokasiSchema";
import { MasterLokasiQuery } from "@/utils/query/inventory/master-lokasi-query";
import { buildMasterLokasiFilters } from "@/utils/filters/inventory/FilterMasterLokasi";

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
  buildFilters: buildMasterLokasiFilters,
  buildQuery,
  successMessage: "Data Master Lokasi berhasil diambil.",
  emptyMessage: (branch) => `Tidak ada data untuk branch '${branch}'.`,
  errorContext: "Error saat mengambil data Master Lokasi.",
  return404IfEmpty: false,
});
