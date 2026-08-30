// src/pages/api/klik/sales-harian.ts
import { createGetHandler } from "@/lib/handlerFactory";
import type { QueryParam } from "@/types/queryParams";
import { KlikFilters, klikSchemas } from "@/schema/klik/klikSchemas";
import { getMemberSkiplist } from "@/utils/memberSkiplist";
import { querySalesKlik } from "@/utils/query/klik/querySalesKlik";

// Filter sales memakai `trjd_transactiondate` (bukan `obi_tglpb` seperti FilterKlik
// untuk daftar PB) karena agregat omzet ditentukan tanggal transaksi struk.
const buildFiltersSales = (filters: KlikFilters) => {
  const conds: string[] = [];
  const params: QueryParam[] = [];
  if (filters.startDate) {
    conds.push(`trjd_transactiondate >= $${params.length + 1}`);
    params.push(`${filters.startDate} 00:00:00`);
  }
  if (filters.endDate) {
    conds.push(`trjd_transactiondate < $${params.length + 1}`);
    params.push(`${filters.endDate} 23:59:59`);
  }
  const members = getMemberSkiplist();
  if (members.length > 0) {
    conds.push(`NOT (cus.cus_kodemember = ANY($${params.length + 1}))`);
    params.push(members);
  }
  return { conditions: conds.join(" AND "), params };
};

const buildQuery = (conditions: string, _params: QueryParam[]) => `
${querySalesKlik(conditions)}
`;

export default createGetHandler<KlikFilters>({
  schema: klikSchemas,
  buildFilters: buildFiltersSales,
  buildQuery,
  successMessage: "Sales klik harian berhasil diambil.",
  emptyMessage: "Tidak ada data sales klik untuk rentang tanggal tersebut.",
  errorContext: "Sales Klik Harian",
  return404IfEmpty: false,
});
