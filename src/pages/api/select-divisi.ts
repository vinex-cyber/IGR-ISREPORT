// src/pages/api/select-divisi.ts
import { z } from "zod";
import { createGetHandler } from "@/lib/handlerFactory";

// ============================================================
// Schema (kosong karena tidak ada filter)
// ============================================================
const SelectDivisiSchema = z.object({});

// ============================================================
// Query
// ============================================================
const buildQuery = () => `
  SELECT
    div_kodedivisi,
    div_namadivisi
  FROM
    tbmaster_divisi
  ORDER BY
    div_kodedivisi
`;

// ============================================================
// Handler
// ============================================================
export default createGetHandler({
  schema: SelectDivisiSchema,
  buildFilters: () => ({ conditions: "", params: [] }),
  buildQuery,
  successMessage: "Data divisi berhasil diambil.",
  emptyMessage: (branch) => `Tidak ada data divisi untuk branch '${branch}'.`,
  errorContext: "Select Divisi",
});
