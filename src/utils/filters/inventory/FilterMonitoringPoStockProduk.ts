// src/utils/filters/inventory/FilterMonitoringPoStockProduk.ts

import { MonitoringPoProdukStockFilters } from "@/schema/inventory/monitoring-po-produk-stock/MonitoringPoProdukStockSchema";
// import { normalizeToArray } from "@/utils/normalizeToArray";
import { QueryParam } from "@/types/queryParams";

interface FilterMonitoringPoStockProdukResult {
  conditions: string;
  params: QueryParam[];
}

export const buildMonitoringPoStockProdukFilters = (
  filters: MonitoringPoProdukStockFilters,
): FilterMonitoringPoStockProdukResult => {
  const conditions: string[] = [];
  const params: QueryParam[] = [];

  if (filters.prdcd) {
    conditions.push(`plu = ANY(string_to_array($${params.length + 1}, ','))`);
    params.push(filters.prdcd);
  }

  return {
    conditions: conditions.length > 0 ? conditions.join("\nAND ") : "1 = 1",
    params,
  };
};
