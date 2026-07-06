// ============================================================
// Schema

import { createGetHandler } from "@/lib/handlerFactory";
import { z } from "zod";

// ============================================================
export const DaftarLokasiSchema = z.object({});

// ============================================================
// Query
// ============================================================

const buildQuery = () => `
      select DISTINCT 
        st_lokasi,
      CASE
        when st_lokasi = '01' THEN 'BARANG BAIK'
        when st_lokasi = '02' THEN 'BARANG RETUR'
        when st_lokasi = '03' THEN 'BARANG RUSAK'
      END nama_lokasi
      from tbmaster_stock
      order by st_lokasi
    `;

export default createGetHandler({
  schema: DaftarLokasiSchema,
  buildFilters: () => ({ conditions: "", params: [] }),
  buildQuery,
  successMessage: "Data Lokasi berhasil diambil.",
  emptyMessage: (branch) => `Tidak ada data Lokasi untuk branch '${branch}'.`,
  errorContext: "Daftar Lokasi",
});
