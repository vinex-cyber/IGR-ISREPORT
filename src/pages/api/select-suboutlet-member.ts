// src/pages/api/select-suboutlet-member.ts
import { z } from "zod";
import { createGetHandler } from "@/lib/handlerFactory";

//===============================================================
// Schema
//===============================================================
const SelectSubOutletMemberSchema = z.object({
  kodeOutlet: z.string().optional(),
});

//===============================================================
// Filter
//===============================================================

//===============================================================
// Query
//===============================================================
const buildQuery = () => `
            SELECT
                sub_kodeoutlet,
                out_namaoutlet,
                sub_kodesuboutlet,
                sub_namasuboutlet
            FROM
                tbmaster_suboutlet
            LEFT JOIN
                tbmaster_outlet ON sub_kodeoutlet = out_kodeoutlet
        `;

export default createGetHandler({
  schema: SelectSubOutletMemberSchema,
  buildFilters: () => ({ conditions: "", params: [] }),
  buildQuery,
  emptyMessage: (branch) =>
    `Tidak ada data sub outlet untuk branch '${branch}'.`,
  successMessage: (branch) =>
    `Data sub outlet berhasil diambil untuk branch '${branch}'.`,
  errorContext: "Daftar Sub Outlet",
});
