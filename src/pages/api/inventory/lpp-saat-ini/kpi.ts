// src/pages/api/inventory/lpp-saat-ini/kpi.ts
import { z } from "zod";
import { createGetHandler } from "@/lib/handlerFactory";
import { QueryLppKpi } from "@/utils/query/queryLppSaatIni";

// KPI dashboard: tanpa filter, selalu per-branch dari cookie.
export default createGetHandler({
  schema: z.object({}),
  buildFilters: () => ({ conditions: "", params: [] }),
  buildQuery: () => QueryLppKpi(),
  successMessage: (branch) => `KPI LPP branch '${branch}' berhasil diambil.`,
  errorContext: "KPI LPP",
  emptyMessage: (branch) => `Tidak ada data KPI LPP untuk branch '${branch}'.`,
  return404IfEmpty: false,
});
