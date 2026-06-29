import type { QueryParam } from "@/types/queryParams";
import { normalizeToArray } from "@/utils/normalizeToArray";

export const applyStrukFilters = (
  filters: {
    struk?: string | string[];
    strukSupplier?: string | string[];
    startDate?: string;
    endDate?: string;
  },
  conditions: string[],
  params: QueryParam[],
) => {
  // Filter Struk
  const struks = normalizeToArray(filters.struk);
  if (struks.length > 0) {
    if (struks.length === 1) {
      conditions.push(`dtl_struk = $${params.length + 1}`);
      params.push(struks[0]);
    } else {
      conditions.push(`dtl_struk = ANY($${params.length + 1})`);
      params.push(struks);
    }
  }

  // Filter Struk Supplier (langsung dengan date range di dalam subquery)
  const strukSuppliers = normalizeToArray(filters.strukSupplier);
  if (strukSuppliers.length > 0 && filters.startDate && filters.endDate) {
    conditions.push(`dtl_struk = ANY(
      select distinct
        to_char(trjd_transactiondate, 'yyyymmdd')
        || trjd_create_by
        || trjd_transactionno
        || trjd_transactiontype as struk
      from tbtr_jualdetail
      join tbmaster_hargabeli
        on substr(trjd_prdcd,1,6)||'0' = hgb_prdcd
      where date_trunc('day', trjd_transactiondate)
        between $${params.length + 1} and $${params.length + 2}
        and hgb_kodesupplier = ANY($${params.length + 3})
    )`);

    params.push(filters.startDate, filters.endDate, strukSuppliers);
  }

  return { conditions, params };
};
