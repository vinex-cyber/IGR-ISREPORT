// /src/pages/api/daftar-kodekasir.ts
import { z } from "zod";
import { createSimpleGetHandler } from "@/lib/handlerFactory";

//===============================================================
// Schema
//===============================================================
const DaftarKodeKasirSchema = z.object({});

//===============================================================
// Query
//===============================================================
const buildQuery = () => `
      SELECT 
        DISTINCT(userid),
        username
      FROM tbmaster_user
      LEFT JOIN tbtr_jualheader on userid = jh_cashierid
        where jh_transactiondate >= current_date - INTERVAL '2 MONTH'
        AND jh_transactiondate <= current_date
        order by userid;
    `;

export default createSimpleGetHandler({
  schema: DaftarKodeKasirSchema,
  buildFilters: () => ({ conditions: "", params: [] }),
  buildQuery,
  successMessage: "Data Daftar Kode Kasir berhasil diambil.",
  emptyMessage: (branch) =>
    `Tidak ada data Daftar Kode Kasir untuk branch '${branch}'.`,
  errorContext: "Daftar Kode Kasir",
});
