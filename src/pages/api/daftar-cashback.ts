// src/pages/api/daftar-cashback.ts
import { z } from "zod";
import { createGetHandler } from "@/lib/handlerFactory";
import type { QueryParam } from "@/types/queryParams";

// ============================================================
// Schema
// ============================================================
const DaftarCashbackSchema = z.object({
  search: z.string().trim().optional().default(""),
});

type DaftarCashbackFilters = z.infer<typeof DaftarCashbackSchema>;

// ============================================================
// Filter Builder
// ============================================================
function buildFilters(filters: DaftarCashbackFilters) {
  const keyword = `%${filters.search.toLowerCase()}%`;

  const conditions = `
    LOWER(COALESCE(cbh_kodepromosi, '')) LIKE $1
    OR LOWER(COALESCE(cbh_namapromosi, '')) LIKE $1
  `;

  const params: QueryParam[] = [keyword];

  return { conditions, params };
}

// ============================================================
// Query Builder
// ============================================================
function buildQuery(conditions: string) {
  return `
    WITH cashback_unique AS (
      /**
       * Satu kode promosi hanya menghasilkan satu baris.
       * Jika kode yang sama memiliki beberapa periode,
       * periode dengan tanggal akhir terbaru yang digunakan.
       */
      SELECT DISTINCT ON (cbh_kodepromosi)
        cbh_kodepromosi,
        cbh_namapromosi,
        cbh_tglawal,
        cbh_tglakhir
      FROM tbtr_cashback_hdr
      ORDER BY
        cbh_kodepromosi ASC,
        cbh_tglakhir DESC NULLS LAST,
        cbh_tglawal DESC NULLS LAST
    )

    SELECT
      cbh_kodepromosi,
      cbh_namapromosi,
      TO_CHAR(cbh_tglawal, 'YYYY-MM-DD') AS cbh_tglawal,
      TO_CHAR(cbh_tglakhir, 'YYYY-MM-DD') AS cbh_tglakhir,
      CASE
        WHEN cbh_tglakhir >= CURRENT_DATE
        THEN 'AKTIF'
        ELSE 'NON AKTIF'
      END AS cbh_status

    FROM cashback_unique
    WHERE ${conditions}

    /**
     * Urutan dibuat stabil.
     * Ketika tanggal akhir sama, kode promosi menjadi pembeda.
     */
    ORDER BY
      cbh_tglakhir DESC NULLS LAST,
      cbh_kodepromosi ASC
  `;
}

// ============================================================
// Handler
// ============================================================
export default createGetHandler<DaftarCashbackFilters>({
  schema: DaftarCashbackSchema,
  buildFilters,
  buildQuery,
  successMessage: "Data daftar cashback berhasil diambil.",
  emptyMessage: (branch) => `Tidak ada data cashback untuk branch '${branch}'.`,
  errorContext: "Daftar Cashback",
  return404IfEmpty: false,
});
