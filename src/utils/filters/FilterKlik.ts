import { KlikFilters } from "@/schema/klik/klikSchemas";
import { QueryParam } from "@/types/queryParams";
import { normalizeToArray } from "@/utils/normalizeToArray";

export const FilterKlik = (filters: KlikFilters) => {
  const conditions = [];
  const params: QueryParam[] = [];

  // Filter untuk tanggal (startDate dan endDate)
  if (filters.startDate && filters.endDate) {
    conditions.push(`
        obi_tglpb >= $${params.length + 1}
        AND obi_tglpb < $${params.length + 2}
    `);

    params.push(`${filters.startDate} 00:00:00`, `${filters.endDate} 23:59:59`);
  } else {
    if (filters.startDate) {
      conditions.push(`obi_tglpb >= $${params.length + 1}`);
      params.push(`${filters.startDate} 00:00:00`);
    }
    if (filters.endDate) {
      conditions.push(`obi_tglpb < $${params.length + 1}`);
      params.push(`${filters.endDate} 23:59:59`);
    }
  }
  // Filter Kode PLU
  const prdcd = normalizeToArray(filters.prdcd);
  if (prdcd.length > 0) {
    if (prdcd.length === 1) {
      conditions.push(`prdcd = $${params.length + 1}`);
      params.push(prdcd[0]);
    } else {
      conditions.push(`prdcd = ANY($${params.length + 1})`);
      params.push(prdcd);
    }
  }
  // Filter Status PB
  if (filters.status) {
    conditions.push(`status = $${params.length + 1}`);
    params.push(filters.status);
  }

  return {
    conditions: conditions.length > 0 ? `${conditions.join(" AND ")}` : "",
    params,
  };
};
