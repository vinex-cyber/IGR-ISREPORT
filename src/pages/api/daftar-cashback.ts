// src/pages/api/daftar-cashback.ts

import type { NextApiRequest, NextApiResponse } from "next";

import { getPool, type BranchType } from "@/lib/db";

import type { DaftarCashbackRows } from "@/configs/input/daftar-cashbackConfig";

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

function getQueryString(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value?.trim() ?? "";
}

export default async function daftarCashbackHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<DaftarCashbackRows[]>>,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);

    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    // Branch database
    const branch = (req.query.branch as BranchType) || "IGRCPG";

    const pool = getPool(branch);

    // Pagination
    const page = parsePositiveInteger(req.query.page, 1);

    const requestedPageSize = parsePositiveInteger(req.query.pageSize, 10);

    // Maksimal 100 data per halaman
    const pageSize = Math.min(requestedPageSize, 100);

    const offset = (page - 1) * pageSize;

    // Search
    const search = getQueryString(req.query.search).toLowerCase();

    const keyword = `%${search}%`;

    /**
     * cashback_unique:
     *
     * Satu kode promosi hanya menghasilkan satu baris.
     * Jika kode yang sama memiliki beberapa periode,
     * periode dengan tanggal akhir terbaru yang digunakan.
     */
    const result = await pool.query<DaftarCashbackRows>(
      `
        WITH cashback_unique AS (
          SELECT DISTINCT ON (
            cbh_kodepromosi
          )
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

          TO_CHAR(
            cbh_tglawal,
            'YYYY-MM-DD'
          ) AS cbh_tglawal,

          TO_CHAR(
            cbh_tglakhir,
            'YYYY-MM-DD'
          ) AS cbh_tglakhir,

          CASE
            WHEN cbh_tglakhir >= CURRENT_DATE
            THEN 'AKTIF'
            ELSE 'NON AKTIF'
          END AS cbh_status

        FROM cashback_unique

        WHERE
          LOWER(
            COALESCE(
              cbh_kodepromosi,
              ''
            )
          ) LIKE $1

          OR LOWER(
            COALESCE(
              cbh_namapromosi,
              ''
            )
          ) LIKE $1

        /**
         * Urutan dibuat stabil.
         *
         * Ketika tanggal akhir sama,
         * kode promosi menjadi pembeda.
         */
        ORDER BY
          cbh_tglakhir DESC NULLS LAST,
          cbh_kodepromosi ASC

        LIMIT $2
        OFFSET $3
        `,
      [keyword, pageSize, offset],
    );

    /**
     * Count menggunakan sumber data yang sama
     * dengan main query.
     *
     * Jadi total tidak menghitung kode cashback
     * yang sama lebih dari satu kali.
     */
    const countResult = await pool.query<{
      total: string;
    }>(
      `
        WITH cashback_unique AS (
          SELECT DISTINCT ON (
            cbh_kodepromosi
          )
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
          COUNT(*) AS total

        FROM cashback_unique

        WHERE
          LOWER(
            COALESCE(
              cbh_kodepromosi,
              ''
            )
          ) LIKE $1

          OR LOWER(
            COALESCE(
              cbh_namapromosi,
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
