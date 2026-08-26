// src/pages/api/evaluasi-sales/today-by-divisi.ts
import { z } from "zod";

import { createGetHandler } from "@/lib/handlerFactory";
import { TodaySalesByDivisiQuery } from "@/utils/query/queryTodaySales";

const buildQuery = () => TodaySalesByDivisiQuery();

export default createGetHandler({
  schema: z.object({}),
  buildFilters: () => ({ conditions: "", params: [] }),
  buildQuery,
  successMessage: "Data sales hari ini per divisi berhasil diambil.",
  emptyMessage: (branch) =>
    `Belum ada transaksi hari ini untuk branch '${branch}'.`,
  errorContext: "Sales Hari Ini per Divisi",
  return404IfEmpty: false,
});
