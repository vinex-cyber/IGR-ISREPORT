import type { NextApiRequest, NextApiResponse } from "next";

import { getPool, type BranchType } from "@/lib/db";
import type { DaftarGiftRows } from "@/configs/input/daftar-giftConfig";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  total?: number;
  message?: string;
  error?: string;
};

function parsePositiveInteger(
  value: string | string[] | undefined,
  defaultValue: number,
): number {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const parsedValue = Number(rawValue);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return defaultValue;
  }

  return parsedValue;
}

export default async function daftarGiftHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<DaftarGiftRows[]>>,
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    // Branch database
    const branch = (req.query.branch as BranchType) || "IGRCPG";

    // Database pool
    const pool = getPool(branch);

    // Pagination
    const page = parsePositiveInteger(req.query.page, 1);

    const requestedPageSize = parsePositiveInteger(req.query.pageSize, 10);

    // Batasi maksimal data per halaman
    const pageSize = Math.min(requestedPageSize, 100);

    const offset = (page - 1) * pageSize;

    // Search
    const rawSearch = Array.isArray(req.query.search)
      ? req.query.search[0]
      : req.query.search;

    const search = rawSearch?.trim() ?? "";
    const keyword = `%${search.toLowerCase()}%`;

    /*
     * DISTINCT ON memastikan satu kode promosi
     * hanya menghasilkan satu baris.
     *
     * Jika kode yang sama memiliki beberapa data,
     * yang diambil adalah data dengan tanggal akhir
     * paling baru.
     */
    const result = await pool.query<DaftarGiftRows>(
      `
      WITH gift_unique AS (
        SELECT DISTINCT ON (
          gfh_kodepromosi
        )
          gfh_kodepromosi,
          gfh_namapromosi,
          gfh_tglawal,
          gfh_tglakhir

        FROM tbtr_gift_hdr

        WHERE
          LOWER(
            COALESCE(
              gfh_kodepromosi,
              ''
            )
          ) LIKE $1

          OR LOWER(
            COALESCE(
              gfh_namapromosi,
              ''
            )
          ) LIKE $1

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

        TO_CHAR(
          gfh_tglawal,
          'YYYY-MM-DD'
        ) AS gfh_tglawal,

        TO_CHAR(
          gfh_tglakhir,
          'YYYY-MM-DD'
        ) AS gfh_tglakhir,

        CASE
          WHEN gfh_tglakhir >= CURRENT_DATE
          THEN 'AKTIF'
          ELSE 'NON AKTIF'
        END AS gfh_status

      FROM gift_unique

      /*
       * Urutan pagination harus stabil.
       *
       * gfh_kodepromosi menjadi pembeda
       * ketika tanggal akhirnya sama.
       */
      ORDER BY
        gfh_tglakhir DESC NULLS LAST,
        gfh_kodepromosi ASC

      LIMIT $2
      OFFSET $3
      `,
      [keyword, pageSize, offset],
    );

    /*
     * Total harus menghitung data yang sama
     * dengan main query, yaitu satu kode
     * promosi dihitung satu kali.
     */
    const countResult = await pool.query<{
      total: string;
    }>(
      `
      SELECT
        COUNT(
          DISTINCT gfh_kodepromosi
        ) AS total

      FROM tbtr_gift_hdr

      WHERE
        LOWER(
          COALESCE(
            gfh_kodepromosi,
            ''
          )
        ) LIKE $1

        OR LOWER(
          COALESCE(
            gfh_namapromosi,
            ''
          )
        ) LIKE $1
      `,
      [keyword],
    );

    const total = Number(countResult.rows[0]?.total ?? 0);

    return res.status(200).json({
      success: true,
      data: result.rows,
      total,
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    return res.status(500).json({
      success: false,
      message: "DB connection failed",
      error: errorMessage,
    });
  }
}
