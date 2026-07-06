// src/pages/api/daftar-member.ts
import { z } from "zod";
import { createGetHandler } from "@/lib/handlerFactory";
import type { QueryParam } from "@/types/queryParams";

// ============================================================
// Schema
// ============================================================
const DaftarMemberSchema = z.object({
  search: z.string().trim().optional().default(""),
});

type DaftarMemberFilters = z.infer<typeof DaftarMemberSchema>;

// ============================================================
// Filter Builder
// ============================================================
function buildFilters(filters: DaftarMemberFilters) {
  if (!filters.search) {
    return {
      conditions: `
        cus_recordid IS NULL
        AND COALESCE(cus_namamember, '') <> 'NEW'
      `,
      params: [],
    };
  }

  const keywordLike = `%${filters.search}%`;

  const conditions = `
    cus_recordid IS NULL
    AND COALESCE(cus_namamember, '') <> 'NEW'
    AND (
      TO_TSVECTOR('simple', COALESCE(cus_namamember, '')) @@ PLAINTO_TSQUERY('simple', $1)
      OR COALESCE(cus_kodemember, '') ILIKE $2
    )
  `;

  const params: QueryParam[] = [filters.search, keywordLike];

  return { conditions, params };
}

// ============================================================
// Query Builder
// ============================================================
function buildQuery(conditions: string, params: QueryParam[]) {
  if (params.length === 0) {
    return `
      SELECT
        cus_kodeigr,
        cus_kodemember,
        cus_namamember,
        CASE
          WHEN COALESCE(cus_flagmemberkhusus, 'N') = 'Y'
          THEN 'MERAH'
          ELSE 'BIRU'
        END AS jenis_member
      FROM tbmaster_customer
      WHERE ${conditions}
      ORDER BY cus_namamember ASC
    `;
  }

  return `
    SELECT
      cus_kodeigr,
      cus_kodemember,
      cus_namamember,

      CASE
        WHEN COALESCE(cus_flagmemberkhusus, 'N') = 'Y'
        THEN 'MERAH'
        ELSE 'BIRU'
      END AS jenis_member,

      (
        TS_RANK_CD(
          TO_TSVECTOR('simple', COALESCE(cus_namamember, '')),
          PLAINTO_TSQUERY('simple', $1)
        )
        +
        CASE
          WHEN COALESCE(cus_kodemember, '') ILIKE $2
          THEN 5.0
          ELSE 0
        END
      ) AS rank

    FROM tbmaster_customer
    WHERE ${conditions}

    ORDER BY
      rank DESC,
      cus_kodeigr ASC NULLS LAST,
      cus_kodemember ASC NULLS LAST,
      cus_namamember ASC NULLS LAST
  `;
}

// ============================================================
// Handler
// ============================================================
export default createGetHandler<DaftarMemberFilters>({
  schema: DaftarMemberSchema,
  buildFilters,
  buildQuery,
  successMessage: "Data daftar member berhasil diambil.",
  emptyMessage: (branch) => `Tidak ada data member untuk branch '${branch}'.`,
  errorContext: "Daftar Member",
  return404IfEmpty: false,
  paginated: true,
});
