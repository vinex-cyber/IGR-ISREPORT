// src/pages/api/daftar-produk-terkait.ts
import { z } from "zod";
import { createGetHandler } from "@/lib/handlerFactory";
import type { QueryParam } from "@/types/queryParams";

// ============================================================
// Schema
// ============================================================
const DaftarProdukTerkaitSchema = z.object({
  prdcd: z.string().trim().optional().default(""),
  search: z.string().trim().optional().default(""),
});

type DaftarProdukTerkaitFilters = z.infer<typeof DaftarProdukTerkaitSchema>;

// ============================================================
// Filter Builder
// ============================================================
// PLU terkait = 6 digit awal sama, digit akhir bebas.
// Contoh: 0060410 -> 006041% (0060410, 0060411, 0060412, ...)
function buildFilters(filters: DaftarProdukTerkaitFilters) {
  const prefix = filters.prdcd.slice(0, 6);
  const prefixLike = `${prefix}%`;
  const keywordLike = `%${filters.search}%`;

  const conditions = `
    prd_prdcd LIKE $1
    AND (
      $2 = ''
      OR TO_TSVECTOR('simple', prd_deskripsipanjang) @@ PLAINTO_TSQUERY('simple', $2)
      OR prd_prdcd ILIKE $3
    )
  `;

  const params: QueryParam[] = [prefixLike, filters.search, keywordLike];

  return { conditions, params };
}

// ============================================================
// Query Builder
// ============================================================
function buildQuery(conditions: string) {
  return `
    SELECT
      prd_prdcd,
      prd_deskripsipanjang,
      prd_frac||' / '||prd_unit AS satuan,
      prd_hrgjual AS harga,
      COALESCE(st_saldoakhir, 0) AS st_saldoakhir,

      -- ranking gabungan
      (
        TS_RANK_CD(
          TO_TSVECTOR('simple', prd_deskripsipanjang),
          PLAINTO_TSQUERY('simple', $2)
        )
        +
        CASE
          WHEN prd_prdcd ILIKE $3 THEN 5.0  -- boost kalau match kode
          ELSE 0
        END
      ) AS rank

    FROM tbmaster_prodmast
    LEFT JOIN tbmaster_stock
      ON prd_prdcd = st_prdcd
      AND st_lokasi = '01'

    WHERE ${conditions}

    ORDER BY
      rank DESC,
      prd_prdcd
  `;
}

// ============================================================
// Handler
// ============================================================
export default createGetHandler<DaftarProdukTerkaitFilters>({
  schema: DaftarProdukTerkaitSchema,
  buildFilters,
  buildQuery,
  successMessage: "Data produk terkait berhasil diambil.",
  emptyMessage: (branch) =>
    `Tidak ada produk terkait untuk branch '${branch}'.`,
  errorContext: "Daftar Produk Terkait",
  return404IfEmpty: false,
  paginated: true,
});
