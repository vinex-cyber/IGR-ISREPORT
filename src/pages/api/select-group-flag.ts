// src/pages/api/select-group-flag.ts
import { z } from "zod";
import { QueryGroupFlag } from "@/utils/query/queryGroupFlag";
import { createSimpleGetHandler } from "@/lib/handlerFactory";

// ============================================================
// Schema (kosong karena tidak ada filter)
// ============================================================
const SelectGroupFlagSchema = z.object({});

const buildQuery = () => `
            SELECT DISTINCT
                flag
            FROM
                (${QueryGroupFlag()}) AS Flag
        `;
export default createSimpleGetHandler({
  schema: SelectGroupFlagSchema,
  buildFilters: () => ({ conditions: "", params: [] }),
  buildQuery,
  successMessage: "Data daftar flag berhasil diambil.",
  emptyMessage: (branch) =>
    `Tidak ada data daftar flag untuk branch '${branch}'.`,
  errorContext: "Daftar Flag",
});
