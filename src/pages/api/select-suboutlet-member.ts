// src/pages/api/select-suboutlet-member.ts
import { z } from "zod";
import { createSimpleGetHandler } from "@/lib/handlerFactory";

//===============================================================
// Schema
//===============================================================
const SelectSubOutletMemberSchema = z.object({});

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
            WHERE
                ($1::text IS NULL OR sub_kodeoutlet = $1)
        `;

export default createSimpleGetHandler({
  schema: SelectSubOutletMemberSchema,
  buildFilters: () => ({ conditions: "", params: [] }),
  buildQuery,
  emptyMessage: (branch) =>
    `Tidak ada data sub outlet untuk branch '${branch}'.`,
  successMessage: (branch) =>
    `Data sub outlet berhasil diambil untuk branch '${branch}'.`,
  errorContext: "Daftar Sub Outlet",
});
