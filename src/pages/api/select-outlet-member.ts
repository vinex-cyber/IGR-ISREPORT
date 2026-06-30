// src/pages/api/select-outlet-member.ts
import { z } from "zod";
import { createSimpleGetHandler } from "@/lib/handlerFactory";

//===============================================================
// Schema
//===============================================================
const SelectOutletMemberSchema = z.object({});

//===============================================================
// Query
//===============================================================
const buildQuery = () => `
            SELECT
                out_kodeoutlet,
                out_namaoutlet
            FROM
                tbmaster_outlet
            ORDER BY
                out_kodeoutlet
        `;

export default createSimpleGetHandler({
  schema: SelectOutletMemberSchema,
  buildFilters: () => ({ conditions: "", params: [] }),
  buildQuery,
  errorContext: "Daftar Outlet",
  successMessage: (branch) =>
    `Data outlet berhasil diambil untuk branch '${branch}'.`,
  emptyMessage: (branch) => `Tidak ada data outlet untuk branch '${branch}'.`,
});
