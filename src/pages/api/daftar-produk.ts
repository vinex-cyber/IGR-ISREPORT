// src/pages/api/daftar-produk.ts
import { z } from "zod";
import { createGetHandler } from "@/lib/handlerFactory";
import type { QueryParam } from "@/types/queryParams";

// ============================================================
// Schema
// ============================================================
const DaftarProdukSchema = z.object({
  search: z.string().trim().optional().default(""),
});

type DaftarProdukFilters = z.infer<typeof DaftarProdukSchema>;

// ============================================================
// Filter Builder
// ============================================================
function buildFilters(filters: DaftarProdukFilters) {
  const keywordLike = `%${filters.search}%`;

  const conditions = `
    prd_prdcd LIKE '%0'
    AND (
      $1 = ''
      OR TO_TSVECTOR('simple', prd_deskripsipanjang) @@ PLAINTO_TSQUERY('simple', $1)
      OR prd_prdcd ILIKE $2
    )
  `;

  const params: QueryParam[] = [filters.search, keywordLike];

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
          PLAINTO_TSQUERY('simple', $1)
        )
        +
        CASE
          WHEN prd_prdcd ILIKE $2 THEN 5.0  -- boost kalau match kode
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
export default createGetHandler<DaftarProdukFilters>({
  schema: DaftarProdukSchema,
  buildFilters,
  buildQuery,
  successMessage: "Data daftar produk berhasil diambil.",
  emptyMessage: (branch) => `Tidak ada data produk untuk branch '${branch}'.`,
  errorContext: "Daftar Produk",
  return404IfEmpty: false,
  paginated: true,
});
