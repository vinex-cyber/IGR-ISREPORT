// src/pages/api/select-departement.ts
import { z } from "zod";
import { createSimpleGetHandler } from "@/lib/handlerFactory";

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
                div_namadivisi,
                dep_kodedepartement,
                dep_namadepartement
            FROM
                tbmaster_departement
            left join tbmaster_divisi on dep_kodedivisi = div_kodedivisi
            ORDER BY
                dep_kodedivisi,
                dep_kodedepartement
        `;
// ============================================================
// Handler
// ============================================================
export default createSimpleGetHandler({
  schema: SelectDivisiSchema,
  buildFilters: () => ({ conditions: "", params: [] }),
  buildQuery,
  successMessage: "Data daftar departement berhasil diambil.",
  emptyMessage: (branch) =>
    `Tidak ada data daftar departement untuk branch '${branch}'.`,
  errorContext: "Dafatar Departement",
});
