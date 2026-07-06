// src/configs/inventory/master-lokasi/filter-default-value.ts

import type { MasterLokasiFilters } from "@/schema/inventory/master-lokasi/masterLokasiSchema";

export function getFilterMasterLokasiDefaultValues(): MasterLokasiFilters {
  return {
    div: "",
    dept: "",
    katb: "",
    tag: "",

    prdcd: "",
    namaBarang: "",
    kodeMonitoringPlu: "",

    kodeSupplier: [],
    namaSupplier: "",
  };
}
