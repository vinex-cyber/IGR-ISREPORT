// /src/pages/api/inventory/lpp-saat-ini/per-produk.ts
import { createPaginatedGetHandler } from "@/lib/handlerFactory"; // Sesuaikan path
import { FilterLppSaatIniSchema } from "@/schema/filterLppSaatIni";
import { buildFilterLppSaatIni } from "@/utils/filters/FilterLppSaatIni";
import { QueryLppSaatIni } from "@/utils/query/queryLppSaatIni";

const buildQuery = (conditions: string) => `
  SELECT
    *
  FROM (${QueryLppSaatIni({ conditions })}) as lpp
  where st_prdcd is not null
  ORDER BY st_div,st_dept,st_katb,st_prdcd
`;

export default createPaginatedGetHandler({
  schema: FilterLppSaatIniSchema,
  buildFilters: buildFilterLppSaatIni,
  buildQuery,
  successMessage: (branch) =>
    `Data LPP saat ini per produk branch '${branch}' berhasil diambil.`,
  errorContext: "LPP Saat Ini Per Produk",
  emptyMessage: (branch) =>
    `Tidak ada data LPP saat ini per produk untuk branch '${branch}'.`,
});
