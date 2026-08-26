// src/utils/query/queryTrendTahunan.ts

const MONTHS = [
  "01", "02", "03", "04", "05", "06",
  "07", "08", "09", "10", "11", "12",
] as const;

export type RekapSource = { year: number; table: string | null };

// ponytail: nama tabel arsip di-resolve endpoint via information_schema
// (snapshot bulan terakhir yang ada); tahun tanpa arsip → kolom NULL.
export const QueryTrendTahunan = (rekap: RekapSource[]): string => {
  const curYear = new Date().getFullYear();
  const cur = String(new Date().getMonth() + 1).padStart(2, "0");
  const years = [curYear - 2, curYear - 1, curYear];
  const liveYear = curYear;

  const liveCols = MONTHS.map((m) => {
    const stockExpr = `CASE WHEN p.PRD_UNIT = 'KG' AND p.PRD_FRAC = 1000
          THEN (b.ST_SALES * b.ST_AVGCOST) / p.PRD_FRAC
          ELSE b.ST_SALES * b.ST_AVGCOST END`;
    return `COALESCE(SUM(CASE
        WHEN $1 = 'sales' AND '${m}' = '${cur}' THEN ${stockExpr}
        WHEN $1 = 'sales' THEN a.SLS_RPH_${m}
        ELSE a.SLS_RPH_${m} - a.SLS_HPP_${m}
      END), 0) AS l${m}`;
  }).join(",\n            ");

  // ponytail: margin bulan berjalan tidak bisa dari stock (omzet saja) maupun
  // salesbulanan (belum diisi job) — dihitung live dari transaksi bulan ini.
  const mtdMargin = `
    SELECT COALESCE(SUM(
      CASE WHEN t.dtl_rtype = 'S' THEN t.dtl_netto - t.dtl_hpp
           ELSE (t.dtl_netto - t.dtl_hpp) * -1 END), 0)::float8 AS margin
    FROM (
      SELECT x.trjd_transactiontype AS dtl_rtype,
        CASE WHEN x.trjd_flagtax2 = 'Y' AND x.trjd_create_by IN ('IDM','OMI','BKL')
             THEN x.trjd_nominalamt * 1.11 ELSE x.trjd_nominalamt END AS dtl_netto,
        CASE WHEN prd.prd_unit = 'KG'
             THEN x.trjd_quantity * x.trjd_baseprice / 1000
             ELSE x.trjd_quantity * x.trjd_baseprice END AS dtl_hpp
      FROM (
        SELECT DISTINCT trjd_transactiontype, trjd_prdcd, trjd_flagtax2,
               trjd_quantity, trjd_nominalamt, trjd_baseprice, trjd_create_by,
               trjd_recordid
        FROM tbtr_jualdetail
        WHERE trjd_transactiondate >= date_trunc('month', now())
          AND trjd_recordid IS NULL
        UNION ALL
        SELECT DISTINCT trjd_transactiontype, trjd_prdcd, trjd_flagtax2,
               trjd_quantity, trjd_nominalamt, trjd_baseprice, trjd_create_by,
               trjd_recordid
        FROM tbtr_jualdetail_interface
        WHERE trjd_transactiondate >= date_trunc('month', now())
          AND trjd_recordid IS NULL
      ) x
      JOIN tbmaster_prodmast prd ON x.trjd_prdcd = prd.prd_prdcd
      WHERE x.trjd_quantity <> 0
    ) t
  `;

  const rekapSources = rekap.filter((r) => r.table && r.year !== liveYear);
  const rekapCtes = rekapSources
    .map(
      (r, i) => `rekap${i} AS (
        SELECT ${MONTHS.map(
          (m) =>
            `COALESCE(SUM(CASE WHEN $1 = 'sales' THEN a.RSL_RPH_${m} ELSE a.RSL_RPH_${m} - a.RSL_HPP_${m} END), 0) AS r${m}`,
        ).join(",\n            ")}
        FROM ${r.table} a
    )`,
    )
    .join(",\n    ");

  const rekapIdx = new Map(rekapSources.map((r, i) => [r.year, i]));

  const yearCols = (year: number): string => {
    if (year === liveYear) {
      return MONTHS.map((m) => {
        if (m === cur) {
          return `(CASE WHEN $1 = 'margin' THEN (SELECT margin FROM mtd) ELSE l.l${m} END) AS v${year}_${m}`;
        }
        return `(CASE WHEN '${m}' <= '${cur}' THEN l.l${m} END) AS v${year}_${m}`;
      }).join(",\n            ");
    }
    const idx = rekapIdx.get(year);
    if (idx === undefined) {
      return MONTHS.map((m) => `NULL AS v${year}_${m}`).join(",\n            ");
    }
    return MONTHS.map((m) => `rekap${idx}.r${m} AS v${year}_${m}`).join(
      ",\n            ",
    );
  };

  const crossJoins = rekapSources
    .map((_, i) => `CROSS JOIN rekap${i}`)
    .join("\n    ");

  return `
    WITH live AS (
        SELECT ${liveCols}
        FROM TBTR_SALESBULANAN a
        LEFT JOIN tbmaster_prodmast p ON a.SLS_PRDCD = p.PRD_PRDCD
        LEFT JOIN tbmaster_stock b
               ON a.SLS_PRDCD = b.ST_PRDCD AND b.ST_LOKASI = '01'
    )${rekapSources.length > 0 ? ",\n    " + rekapCtes : ""},
    mtd AS (${mtdMargin})
    SELECT  ${years.map(yearCols).join(",\n            ")}
    FROM live l
    ${crossJoins}
  `;
};
