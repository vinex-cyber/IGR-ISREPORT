// src/pages/api/evaluasi-sales/today-by-member.ts
import { z } from "zod";

import { createGetHandler } from "@/lib/handlerFactory";
import { TodaySalesByMemberQuery } from "@/utils/query/queryTodaySales";

const buildQuery = () => TodaySalesByMemberQuery();

export default createGetHandler({
  schema: z.object({}),
  buildFilters: () => ({ conditions: "", params: [] }),
  buildQuery,
  successMessage: "Data sales hari ini per member berhasil diambil.",
  emptyMessage: (branch) =>
    `Belum ada transaksi hari ini untuk branch '${branch}'.`,
  errorContext: "Sales Hari Ini per Member",
  return404IfEmpty: false,
});
