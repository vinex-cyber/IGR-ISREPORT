// api/form-so-harian/index.ts
import { formSoHarianQuery } from "@/utils/query/formSoHarian";
import { FilterFormSoHarianSchema } from "@/schema/filterFormSoHarian";
import { FilterFormSoHarian } from "@/utils/filters/FiltersFormSoHarian";
import { createGetHandler } from "@/lib/handlerFactory";

const buildQuery = (conditions: string) => `
                        select
                            prdcd,
                            desk,
                            satuan,
                            tag,
                            area,
                            alamat,
                            modif_by,
                            plano,
                            lpp,
                            acost,
                            flag,
                            plano_qty,
                            omi_recid4,
                            qty_rom
                        from
                            (${formSoHarianQuery()}) as subquery
                        ${conditions} 
                        order by area asc
        `;

export default createGetHandler({
  schema: FilterFormSoHarianSchema,
  buildFilters: FilterFormSoHarian,
  buildQuery,
  successMessage: (branch) =>
    `Data form so harian berhasil diambil untuk branch '${branch}'.`,
  errorContext: "Form So Harian",
  emptyMessage: (branch) =>
    `Tidak ada data form so harian untuk branch '${branch}'.`,
});
