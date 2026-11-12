// src/pages/api/evaluasi-sales/today-per-kasir.ts
import { z } from "zod";
import { createGetHandler } from "@/lib/handlerFactory";
import { TodayPerKasirQuery } from "@/utils/query/queryTodaySales";

// Ringkasan transaksi hari ini per kasir untuk modal "kasir aktif" di dashboard.
export default createGetHandler({
  schema: z.object({}),
  buildFilters: () => ({ conditions: "", params: [] }),
  buildQuery: () => TodayPerKasirQuery(),
  successMessage: (branch) =>
    `Data kasir hari ini branch '${branch}' berhasil diambil.`,
  errorContext: "Kasir Aktif Hari Ini",
  emptyMessage: (branch) =>
    `Tidak ada transaksi hari ini untuk branch '${branch}'.`,
  return404IfEmpty: false,
});
