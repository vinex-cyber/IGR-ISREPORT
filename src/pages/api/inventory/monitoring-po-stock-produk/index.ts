// src/pages/api/inventory/monitoring-po-stock-produk/index.ts
import { createGetHandler } from "@/lib/handlerFactory";
import {
  type MonitoringPoProdukStockFilters,
  MonitoringPoProdukStockSchema,
} from "@/schema/inventory/monitoring-po-produk-stock/MonitoringPoProdukStockSchema";
import { buildMonitoringPoStockProdukFilters } from "@/utils/filters/inventory/FilterMonitoringPoStockProduk";
import { MonitoringPoStockProdukQuery } from "@/utils/query/inventory/monitoring-po-stock-produk-query";

// ============================================================
// Query Builder
// ============================================================
function buildQuery(conditions: string) {
  return `select * from (${MonitoringPoStockProdukQuery()}) monitoring_po_stock_produk WHERE ${conditions}`;
}

export default createGetHandler<MonitoringPoProdukStockFilters>({
  schema: MonitoringPoProdukStockSchema,
  buildFilters: buildMonitoringPoStockProdukFilters,
  buildQuery,
  emptyMessage: (branch) => `Tidak ada data untuk branch '${branch}'.`,
  successMessage: "Data Monitoring PO Stock Produk berhasil diambil.",
  errorContext: "Error saat mengambil data Monitoring PO Stock Produk.",
});
