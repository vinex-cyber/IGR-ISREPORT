// api/klik/status-order.ts
import { createGetHandler } from "@/lib/handlerFactory";
import type { QueryParam } from "@/types/queryParams";
import { KlikFilters, klikSchemas } from "@/schema/klik/klikSchemas";
import { queryDetailKlik } from "@/utils/query/klik/queryDetailKlik";
import { FilterKlik } from "@/utils/filters/FilterKlik";

const buildQuery = (conditions: string, _params: QueryParam[]) => `
${queryDetailKlik(conditions)}
`;

export default createGetHandler<KlikFilters>({
  schema: klikSchemas,
  buildFilters: FilterKlik,
  buildQuery,
  successMessage: (_branch, filters) =>
    `Data Status Order ${filters?.status ?? "Semua"} berhasil diambil.`,
  emptyMessage: (branch) =>
    `Tidak ada data status order untuk branch '${branch}'.`,
  errorContext: "Daftar Status Order",
  return404IfEmpty: false,
  paginated: true,
});
