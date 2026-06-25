// src/pages/api/daftar-member.ts

import type { NextApiRequest, NextApiResponse } from "next";

import { getPool, type BranchType } from "@/lib/db";

import type { DaftarMemberRows } from "@/configs/input/daftar-memberConfig";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  total?: number;
  message?: string;
  error?: string;
};

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

function getFirstQueryValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value?.trim() ?? "";
}

function parsePositiveInteger(
  value: string | string[] | undefined,
  defaultValue: number,
): number {
  const rawValue = getFirstQueryValue(value);
  const parsedValue = Number(rawValue);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return defaultValue;
  }

  return parsedValue;
}

export default async function daftarMemberHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<DaftarMemberRows[]>>,
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
    const branch =
      (getFirstQueryValue(req.query.branch) as BranchType) || "IGRCPG";

    const pool = getPool(branch);

    // =========================
    // QUERY PARAM
    // =========================
    const page = parsePositiveInteger(req.query.page, DEFAULT_PAGE);

    const requestedPageSize = parsePositiveInteger(
      req.query.pageSize,
      DEFAULT_PAGE_SIZE,
    );

    /**
     * Maksimal data per halaman adalah 100.
     *
     * Contoh:
     * pageSize=20     -> 20
     * pageSize=100    -> 100
     * pageSize=10000  -> 100
     */
    const pageSize = Math.min(requestedPageSize, MAX_PAGE_SIZE);

    const offset = (page - 1) * pageSize;

    const keyword = getFirstQueryValue(req.query.search);

    const keywordLike = `%${keyword}%`;

    // =========================
    // DATA QUERY
    // =========================
    const query = `
      SELECT
        cus_kodeigr,
        cus_kodemember,
        cus_namamember,

        CASE
          WHEN COALESCE(
            cus_flagmemberkhusus,
            'N'
          ) = 'Y'
          THEN 'MERAH'
          ELSE 'BIRU'
        END AS jenis_member,

        (
          TS_RANK_CD(
            TO_TSVECTOR(
              'simple',
              COALESCE(
                cus_namamember,
                ''
              )
            ),
            PLAINTO_TSQUERY(
              'simple',
              $1
            )
          )
          +
          CASE
            WHEN COALESCE(
              cus_kodemember,
              ''
            ) ILIKE $2
            THEN 5.0
            ELSE 0
          END
        ) AS rank

      FROM tbmaster_customer

      WHERE
        cus_recordid IS NULL

        AND COALESCE(
          cus_namamember,
          ''
        ) <> 'NEW'

        AND (
          $1 = ''

          OR TO_TSVECTOR(
            'simple',
            COALESCE(
              cus_namamember,
              ''
            )
          ) @@ PLAINTO_TSQUERY(
            'simple',
            $1
          )

          OR COALESCE(
            cus_kodemember,
            ''
          ) ILIKE $2
        )

      /*
       * ORDER BY dibuat stabil untuk pagination.
       *
       * Apabila nilai rank sama, urutan dilanjutkan
       * menggunakan kode IGR, kode member, dan nama.
       */
      ORDER BY
        rank DESC,
        cus_kodeigr ASC NULLS LAST,
        cus_kodemember ASC NULLS LAST,
        cus_namamember ASC NULLS LAST

      LIMIT $3
      OFFSET $4
    `;

    const result = await pool.query<DaftarMemberRows>(query, [
      keyword,
      keywordLike,
      pageSize,
      offset,
    ]);

    // =========================
    // COUNT QUERY
    // =========================
    const countQuery = `
      SELECT
        COUNT(*) AS total

      FROM tbmaster_customer

      WHERE
        cus_recordid IS NULL

        AND COALESCE(
          cus_namamember,
          ''
        ) <> 'NEW'

        AND (
          $1 = ''

          OR TO_TSVECTOR(
            'simple',
            COALESCE(
              cus_namamember,
              ''
            )
          ) @@ PLAINTO_TSQUERY(
            'simple',
            $1
          )

          OR COALESCE(
            cus_kodemember,
            ''
          ) ILIKE $2
        )
    `;

    const countResult = await pool.query<{
      total: string;
    }>(countQuery, [keyword, keywordLike]);

    const total = Number(countResult.rows[0]?.total ?? 0);

    return res.status(200).json({
      success: true,
      data: result.rows,
      total,
    });
  } catch (error) {
    console.error("[ERROR] /api/daftar-member:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : String(error)
          : undefined,
    });
  }
}
