// src/utils/query/queryTrendTahunanDivisi.ts

const MONTHS = [
  "01", "02", "03", "04", "05", "06",
  "07", "08", "09", "10", "11", "12",
] as const;

import type { RekapSource } from "@/utils/query/queryTrendTahunan";

// ponytail: sama dengan QueryTrendTahunan tapi GROUP BY divisi —
// nama tabel arsip di-resolve endpoint via information_schema.
export const QueryTrendTahunanDivisi = (rekap: RekapSource[]): string => {
  const curYear = new Date().getFullYear();
  const cur = String(new Date().getMonth() + 1).padStart(2, "0");
  const years = [curYear - 2, curYear - 1, curYear];
  const liveYear = curYear;

  const stockExpr = `CASE WHEN p.PRD_UNIT = 'KG' AND p.PRD_FRAC = 1000
        THEN (b.ST_SALES * b.ST_AVGCOST) / p.PRD_FRAC
        ELSE b.ST_SALES * b.ST_AVGCOST END`;

  const liveCols = MONTHS.map(
    (m) => `COALESCE(SUM(CASE
        WHEN $1 = 'sales' AND '${m}' = '${cur}' THEN ${stockExpr}
        WHEN $1 = 'sales' THEN a.SLS_RPH_${m}
        ELSE a.SLS_RPH_${m} - a.SLS_HPP_${m}
      END), 0)::float8 AS l${m}`,
  ).join(",\n            ");

  // ponytail: margin bulan berjalan tidak bisa dari stock (omzet saja) maupun
  // salesbulanan (belum diisi job) — dihitung live dari transaksi bulan ini.
  const mtdMargin = `
    SELECT t.kd AS kd,
           COALESCE(SUM(
             CASE WHEN t.dtl_rtype = 'S' THEN t.dtl_netto - t.dtl_hpp
                  ELSE (t.dtl_netto - t.dtl_hpp) * -1 END), 0)::float8 AS margin
    FROM (
      SELECT x.trjd_transactiontype AS dtl_rtype,
        CASE WHEN x.trjd_flagtax2 = 'Y' AND x.trjd_create_by IN ('IDM','OMI','BKL')
             THEN x.trjd_nominalamt * 1.11 ELSE x.trjd_nominalamt END AS dtl_netto,
        CASE WHEN prd.prd_unit = 'KG'
             THEN x.trjd_quantity * x.trjd_baseprice / 1000
             ELSE x.trjd_quantity * x.trjd_baseprice END AS dtl_hpp,
        prd.prd_kodedivisi AS kd
      FROM (
        SELECT DISTINCT trjd_transactiontype, trjd_prdcd, trjd_flagtax2,
               trjd_quantity, trjd_nominalamt, trjd_baseprice, trjd_create_by,
               trjd_recordid, trjd_transactionno, trjd_cashierstation, trjd_seqno
        FROM tbtr_jualdetail
        WHERE trjd_transactiondate >= date_trunc('month', now())
          AND trjd_recordid IS NULL
        UNION ALL
        SELECT DISTINCT trjd_transactiontype, trjd_prdcd, trjd_flagtax2,
               trjd_quantity, trjd_nominalamt, trjd_baseprice, trjd_create_by,
               trjd_recordid, trjd_transactionno, trjd_cashierstation, trjd_seqno
        FROM tbtr_jualdetail_interface
        WHERE trjd_transactiondate >= date_trunc('month', now())
          AND trjd_recordid IS NULL
      ) x
      JOIN tbmaster_prodmast prd ON x.trjd_prdcd = prd.prd_prdcd
      WHERE x.trjd_quantity <> 0
    ) t
    GROUP BY t.kd
  `;

  const rekapSources = rekap.filter((r) => r.table && r.year !== liveYear);
  const rekapCtes = rekapSources
    .map(
      (r, i) => `rekap${i} AS (
        SELECT  a.rsl_kodedivisi AS kd,
                MAX(d.div_namadivisi) AS nama,
                ${MONTHS.map(
                  (m) =>
                    `COALESCE(SUM(CASE WHEN $1 = 'sales' THEN a.RSL_RPH_${m} ELSE a.RSL_RPH_${m} - a.RSL_HPP_${m} END), 0)::float8 AS r${m}`,
                ).join(",\n                ")}
        FROM ${r.table} a
        LEFT JOIN tbmaster_divisi d ON a.rsl_kodedivisi = d.div_kodedivisi
        GROUP BY a.rsl_kodedivisi
    )`,
    )
    .join(",\n    ");

  const rekapIdx = new Map(rekapSources.map((r, i) => [r.year, i]));

  const yearCols = (year: number): string => {
    if (year === liveYear) {
      return MONTHS.map((m) => {
        if (m === cur) {
          return `(CASE WHEN $1 = 'margin'
                 THEN (SELECT margin FROM mtd WHERE kd IS NOT DISTINCT FROM live.kd)
                 ELSE live.l${m} END) AS v${year}_${m}`;
        }
        return `(CASE WHEN '${m}' <= '${cur}' THEN live.l${m} END) AS v${year}_${m}`;
      }).join(",\n            ");
    }
    const idx = rekapIdx.get(year);
    if (idx === undefined) {
      return MONTHS.map((m) => `NULL::float8 AS v${year}_${m}`).join(
        ",\n            ",
      );
    }
    return MONTHS.map((m) => `rekap${idx}.r${m} AS v${year}_${m}`).join(
      ",\n            ",
    );
  };

  const joins = rekapSources
    .map(
      (_, i) =>
        `FULL OUTER JOIN rekap${i}\n           ON COALESCE(live.kd, '~') = COALESCE(rekap${i}.kd, '~')`,
    )
    .join("\n    ");

  const kdParts = ["live.kd", ...rekapSources.map((_, i) => `rekap${i}.kd`)];
  const namaParts = ["live.nama", ...rekapSources.map((_, i) => `rekap${i}.nama`)];

  return `
    WITH live AS (
        SELECT  COALESCE(p.prd_kodedivisi, '~')       AS kd,
                MAX(d.div_namadivisi)                  AS nama,
                ${liveCols}
        FROM    TBTR_SALESBULANAN a
        LEFT JOIN tbmaster_prodmast p ON a.SLS_PRDCD = p.PRD_PRDCD
        LEFT JOIN tbmaster_stock b
               ON a.SLS_PRDCD = b.ST_PRDCD AND b.ST_LOKASI = '01'
        LEFT JOIN tbmaster_divisi d ON p.prd_kodedivisi = d.div_kodedivisi
        GROUP BY COALESCE(p.prd_kodedivisi, '~')
    )${rekapSources.length > 0 ? ",\n    " + rekapCtes : ""},
    mtd AS (${mtdMargin})
    SELECT  COALESCE(${kdParts.join(", ")}) AS kodedivisi,
            COALESCE(${namaParts.join(", ")}) AS namadivisi,
            ${years.map(yearCols).join(",\n            ")}
    FROM live
    ${joins}
    ORDER BY 1
  `;
};
