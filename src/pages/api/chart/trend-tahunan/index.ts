// src/pages/api/chart/trend-tahunan/index.ts
import { z } from "zod";

import { createGetHandler } from "@/lib/handlerFactory";
import type { QueryParam } from "@/types/queryParams";
import { QueryTrendTigaTahun } from "@/utils/query/queryTrendTahunan";

const TrendTahunanSchema = z.object({
  metric: z.enum(["sales", "margin"]).optional(),
});

const buildFilters = (filters: z.infer<typeof TrendTahunanSchema>) => ({
  conditions: "",
  params: [filters.metric ?? "sales"] as QueryParam[],
});

const buildQuery = () => QueryTrendTigaTahun();

export default createGetHandler({
  schema: TrendTahunanSchema,
  buildFilters,
  buildQuery,
  successMessage: "Data trend tahunan berhasil diambil.",
  emptyMessage: () => "Tidak ada data trend tahunan.",
  errorContext: "Chart Trend Tahunan",
  return404IfEmpty: false,
});
