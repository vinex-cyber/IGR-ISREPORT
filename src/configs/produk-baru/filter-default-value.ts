// src/configs/produk-baru/filter-default-value.ts

import type { FilterProdukBaruInput } from "@/schema/filterProdukBaru";

/**
 * Mengambil tanggal lokal dalam format YYYY-MM-DD.
 */
function getLocalDate(): string {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - offset).toISOString().split("T")[0];
}

export function getFilterProdukBaruDefaultValues(): FilterProdukBaruInput {
  const today = getLocalDate();

  return {
    startDate: today,
    endDate: today,

    div: "",
    dept: "",
    katb: "",
  };
}
