// src/pages/api/klik/pertumbuhan.ts
import { format, startOfMonth } from "date-fns";
import { createGetHandler } from "@/lib/handlerFactory";
import type { QueryParam } from "@/types/queryParams";
import { KlikFilters, klikSchemas } from "@/schema/klik/klikSchemas";
import { getMemberSkiplist } from "@/utils/memberSkiplist";
import { queryPertumbuhanKlik } from "@/utils/query/klik/queryPertumbuhanKlik";

// Rentang 2 bulan: dari awal bulan lalu s/d awal bulan depan (eksklusif),
// supaya queryPertumbuhanKlik mengembalikan 2 baris (bulan lalu & bulan ini).
const buildFiltersPertumbuhan = (_filters: KlikFilters) => {
  const conds: string[] = [];
  const params: QueryParam[] = [];
  const now = new Date();
  const awalBulanLalu = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));
  const awalBulanDepan = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  conds.push(`trjd_transactiondate >= $${params.length + 1}`);
  params.push(format(awalBulanLalu, "yyyy-MM-dd 00:00:00"));
  conds.push(`trjd_transactiondate < $${params.length + 1}`);
  params.push(format(awalBulanDepan, "yyyy-MM-dd 00:00:00"));
  const members = getMemberSkiplist();
  if (members.length > 0) {
    conds.push(`NOT (cus.cus_kodemember = ANY($${params.length + 1}))`);
    params.push(members);
  }
  return { conditions: conds.join(" AND "), params };
};

const buildQuery = (conditions: string, _params: QueryParam[]) => `
${queryPertumbuhanKlik(conditions)}
`;

export default createGetHandler<KlikFilters>({
  schema: klikSchemas,
  buildFilters: buildFiltersPertumbuhan,
  buildQuery,
  successMessage: "Data pertumbuhan sales & margin klik berhasil diambil.",
  emptyMessage: "Tidak ada data pertumbuhan klik.",
  errorContext: "Pertumbuhan Klik",
  return404IfEmpty: false,
});
