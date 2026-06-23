// src/utils/filters/FilterProdukBaru.ts

import type { FilterProdukBaruInput } from "@/schema/filterProdukBaru";

interface FilterProdukBaruResult {
  conditions: string;
  params: string[];
}

export const buildFilterProdukBaru = (
  filters: FilterProdukBaruInput,
): FilterProdukBaruResult => {
  const conditions: string[] = [];
  const params: string[] = [];

  /*
   * Cari transaksi dalam periode.
   *
   * Produk tidak boleh mempunyai transaksi sebelum startDate,
   * sehingga produk tersebut benar-benar baru pada periode yang dipilih.
   */
  const startDateIndex = params.length + 1;
  params.push(filters.startDate);

  const endDateIndex = params.length + 1;
  params.push(filters.endDate);

  conditions.push(`
    d.mstd_tgldoc >= $${startDateIndex}::date
    AND d.mstd_tgldoc < (
      $${endDateIndex}::date + INTERVAL '1 day'
    )
    AND NOT EXISTS (
      SELECT 1
      FROM tbtr_mstran_d lama
      WHERE lama.mstd_prdcd = d.mstd_prdcd
        AND lama.mstd_tgldoc < $${startDateIndex}::date
    )
  `);

  if (filters.div) {
    params.push(filters.div);

    conditions.push(`
      prd.prd_kodedivisi = $${params.length}
    `);
  }

  if (filters.dept) {
    params.push(filters.dept);

    conditions.push(`
      prd.prd_kodedepartement = $${params.length}
    `);
  }

  if (filters.katb) {
    params.push(filters.katb);

    conditions.push(`
      prd.prd_kodekategoribarang = $${params.length}
    `);
  }

  return {
    conditions:
      conditions.length > 0 ? `WHERE ${conditions.join("\nAND ")}` : "",
    params,
  };
};
