import { FilterFormSoHarianInput } from "@/schema/filterFormSoHarian";
import { normalizeToArray } from "@/utils/normalizeToArray";

export const FilterFormSoHarian = (filters: FilterFormSoHarianInput) => {
  const conditions = [];
  const params = [];

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

  return {
    conditions:
      conditions.length > 0 ? `where ${conditions.join(" AND ")}` : "",
    params,
  };
};
