// src/configs/produk-baru/filter-default-value.ts

import type { FilterProdukBaruInput } from "@/schema/filterProdukBaru";

import { isDatabaseBranch } from "@/configs/database-options";
import { getDefaultBranch } from "@/utils/getDefaultBranch";

/**
 * Mengambil tanggal lokal dalam format YYYY-MM-DD.
 */
function getLocalDate(): string {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - offset).toISOString().split("T")[0];
}

/**
 * Menentukan branch awal.
 *
 * Prioritas:
 * 1. Branch berdasarkan IP client
 * 2. NEXT_PUBLIC_APP_NAME
 * 3. Database pertama dari DATABASE_OPTIONS
 */
function resolveDefaultBranch(branch?: string): string {
  const normalizedBranch = branch?.trim();

  if (isDatabaseBranch(normalizedBranch)) {
    return normalizedBranch;
  }

  return getDefaultBranch();
}

/**
 * Menghasilkan default values untuk form Produk Baru.
 *
 * @param branch Branch hasil deteksi IP client.
 */
export function getFilterProdukBaruDefaultValues(
  branch?: string,
): FilterProdukBaruInput {
  const today = getLocalDate();

  return {
    startDate: today,
    endDate: today,

    div: "",
    dept: "",
    katb: "",

    branch: resolveDefaultBranch(branch),
  };
}
