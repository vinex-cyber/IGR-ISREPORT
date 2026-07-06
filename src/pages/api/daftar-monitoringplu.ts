// api/daftar-monitoringplu.ts
import { z } from "zod";
import { createGetHandler } from "@/lib/handlerFactory";
//===============================================================
// Schema
//===============================================================
const DaftarMonitoringPLuSchema = z.object({});

//===============================================================
// Query
//===============================================================
const buildQuery = () => `
      select
        kodemonitoring,
        namamonitoring,
        count(mpl_prdcd) as ttl_plu
      from tbmaster_kodemonitoringplu
      left join tbtr_monitoringplu on kodemonitoring = mpl_kodemonitoring
      group by kodemonitoring, namamonitoring
      order by 1 asc;
    `;

export default createGetHandler({
  schema: DaftarMonitoringPLuSchema,
  buildFilters: () => ({ conditions: "", params: [] }),
  buildQuery,
  successMessage: "Data Daftar Monitoring PLU berhasil diambil.",
  emptyMessage: (branch) =>
    `Tidak ada data Daftar Monitoring PLU untuk branch '${branch}'.`,
  errorContext: "Daftar Monitoring PLU",
});
