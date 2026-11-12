// src/pages/api/inventory/lpp-saat-ini/stock-minus.ts
import { z } from "zod";
import { createGetHandler } from "@/lib/handlerFactory";
import { QueryLppStockMinus } from "@/utils/query/queryLppSaatIni";

// Detail stock minus untuk kartu KPI dashboard: tanpa filter, per-branch dari cookie.
export default createGetHandler({
  schema: z.object({}),
  buildFilters: () => ({ conditions: "", params: [] }),
  buildQuery: () => QueryLppStockMinus(),
  successMessage: (branch) => `Data stock minus branch '${branch}' berhasil diambil.`,
  errorContext: "Stock Minus",
  emptyMessage: (branch) => `Tidak ada stock minus untuk branch '${branch}'.`,
  return404IfEmpty: false,
});
