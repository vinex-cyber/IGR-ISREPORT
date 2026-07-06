import { createGetHandler } from "@/lib/handlerFactory";
import { z } from "zod";

//===============================================================
// Schema
//===============================================================
const DaftarSupplierSchema = z.object({});

//===============================================================
// Query
//===============================================================
const buildQuery = () => `
      select
        hgb_kodesupplier,
        sup_namasupplier,
        count(*) ttl_plu
      from tbmaster_prodmast
      left join tbmaster_hargabeli on hgb_prdcd = prd_prdcd
      left join tbmaster_supplier on hgb_kodesupplier = sup_kodesupplier
      where coalesce(prd_kodetag,'-') not in ('X','N','O')
      and hgb_tipe = '2'
      group by hgb_kodesupplier, sup_namasupplier
    `;

export default createGetHandler({
  schema: DaftarSupplierSchema,
  buildFilters: () => ({ conditions: "", params: [] }),
  buildQuery,
  successMessage: "Data Daftar Supplier berhasil diambil.",
  emptyMessage: (branch) =>
    `Tidak ada data Daftar Supplier untuk branch '${branch}'.`,
  errorContext: "Daftar Supplier",
});
