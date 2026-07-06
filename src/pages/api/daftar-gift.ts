// src/pages/api/daftar-gift.ts
import { z } from "zod";
import { createSimpleGetHandler } from "@/lib/handlerFactory";
import type { QueryParam } from "@/types/queryParams";

// ============================================================
// Schema
// ============================================================
const DaftarGiftSchema = z.object({
  search: z.string().trim().optional().default(""),
});

type DaftarGiftFilters = z.infer<typeof DaftarGiftSchema>;

// ============================================================
// Filter Builder
// ============================================================
function buildFilters(filters: DaftarGiftFilters) {
  const keyword = `%${filters.search.toLowerCase()}%`;

  const conditions = `
    LOWER(COALESCE(gfh_kodepromosi, '')) LIKE $1
    OR LOWER(COALESCE(gfh_namapromosi, '')) LIKE $1
  `;

  const params: QueryParam[] = [keyword];

  return { conditions, params };
}

// ============================================================
// Query Builder
// ============================================================
function buildQuery(conditions: string) {
  return `
    WITH gift_unique AS (
      /*
       * DISTINCT ON memastikan satu kode promosi
       * hanya menghasilkan satu baris.
       *
       * Jika kode yang sama memiliki beberapa data,
       * yang diambil adalah data dengan tanggal akhir
       * paling baru.
       */
      SELECT DISTINCT ON (gfh_kodepromosi)
        gfh_kodepromosi,
        gfh_namapromosi,
        gfh_tglawal,
        gfh_tglakhir
      FROM tbtr_gift_hdr
      WHERE ${conditions}

      /*
       * ORDER BY pertama wajib diawali
       * kolom DISTINCT ON.
       *
       * Tanggal terbaru dipilih ketika
       * terdapat kode yang sama.
       */
      ORDER BY
        gfh_kodepromosi ASC,
        gfh_tglakhir DESC NULLS LAST,
        gfh_tglawal DESC NULLS LAST
    )

    SELECT
      gfh_kodepromosi,
      gfh_namapromosi,
      TO_CHAR(gfh_tglawal, 'YYYY-MM-DD') AS gfh_tglawal,
      TO_CHAR(gfh_tglakhir, 'YYYY-MM-DD') AS gfh_tglakhir,
      CASE
        WHEN gfh_tglakhir >= CURRENT_DATE
        THEN 'AKTIF'
        ELSE 'NON AKTIF'
      END AS gfh_status

    FROM gift_unique

    /*
     * Urutan pagination harus stabil.
     * gfh_kodepromosi menjadi pembeda
     * ketika tanggal akhirnya sama.
     */
    ORDER BY
      gfh_tglakhir DESC NULLS LAST,
      gfh_kodepromosi ASC
  `;
}

// ============================================================
// Handler
// ============================================================
export default createSimpleGetHandler<DaftarGiftFilters>({
  schema: DaftarGiftSchema,
  buildFilters,
  buildQuery,
  successMessage: "Data daftar gift berhasil diambil.",
  emptyMessage: (branch) => `Tidak ada data gift untuk branch '${branch}'.`,
  errorContext: "Daftar Gift",
  return404IfEmpty: true,
});
