// src/configs/lpp-saat-ini/filter-default-value.ts

import type { FilterLppSaatIniInput } from "@/schema/filterLppSaatIni";

/**
 * Default values form LPP Saat Ini.
 */
export function getFilterLppSaatIniDefaultValues(): FilterLppSaatIniInput {
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

    statusTag: "",
    statusQty: undefined,

    lokasi: "01",
    groupFlag: "",

    selectedReport: "per-produk",
  };
}
