// src/configs/lpp-saat-ini/filter-default-value.ts

import type { FilterLppSaatIniInput } from "@/schema/filterLppSaatIni";

import { isDatabaseBranch } from "@/configs/database-options";
import { getDefaultBranch } from "@/utils/getDefaultBranch";

/**
 * Menentukan branch awal.
 *
 * Prioritas:
 * 1. Branch berdasarkan IP client
 * 2. NEXT_PUBLIC_APP_NAME
 * 3. Database pertama pada DATABASE_OPTIONS
 */
function resolveDefaultBranch(branch?: string): string {
  const normalizedBranch = branch?.trim();

  if (isDatabaseBranch(normalizedBranch)) {
    return normalizedBranch;
  }

  return getDefaultBranch();
}

/**
 * Default values form LPP Saat Ini.
 *
 * @param branch Branch hasil deteksi IP client.
 */
export function getFilterLppSaatIniDefaultValues(
  branch?: string,
): FilterLppSaatIniInput {
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
    statusQty: "",

    lokasi: "",
    groupSales: "",

    selectedReport: "per-divisi",

    branch: resolveDefaultBranch(branch),
  };
}
