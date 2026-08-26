// src/utils/query/queryTrendTahunan.ts

const MONTHS = [
  "01", "02", "03", "04", "05", "06",
  "07", "08", "09", "10", "11", "12",
] as const;

// ponytail: arsip per tahun = snapshot bulan 12 (tbtr_rekapsalesbulanan_YYYY_12).
// Kalau arsipnya belum ada (awal tahun sebelum job jalan), query akan gagal.
const rekapTable = (year: number) => `tbtr_rekapsalesbulanan_${year}_12`;

// Satu baris: v24_XX (tahun-2), v25_XX (tahun-1), v26_XX (tahun berjalan;
// NULL untuk bulan yang belum lewat). $1 = metric ('sales' | 'margin').
export const QueryTrendTigaTahun = (): string => {
  const curYear = new Date().getFullYear();
  const cur = String(new Date().getMonth() + 1).padStart(2, "0");
  const years = [curYear - 2, curYear - 1, curYear];

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

  const rekapCols = MONTHS.map(
    (m) =>
      `COALESCE(SUM(CASE WHEN $1 = 'sales' THEN a.RSL_RPH_${m} ELSE a.RSL_RPH_${m} - a.RSL_HPP_${m} END), 0) AS r${m}`,
  ).join(",\n            ");

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

  const rekapCtes = years
    .slice(0, 2)
    .map(
      (y, i) => `rekap${i} AS (
        SELECT ${rekapCols}
        FROM ${rekapTable(y)} a
    )`,
    )
    .join(",\n    ");

  const vPrev = years
    .slice(0, 2)
    .map(
      (y, i) =>
        `${MONTHS.map((m) => `r${i}.r${m} AS v${y}_${m}`).join(",\n            ")}`,
    )
    .join(",\n            ");

  const vCur = MONTHS.map((m) => {
    if (m === cur) {
      return `(CASE WHEN $1 = 'margin' THEN (SELECT margin FROM mtd) ELSE l.l${m} END) AS v${curYear}_${m}`;
    }
    return `(CASE WHEN '${m}' <= '${cur}' THEN l.l${m} END) AS v${curYear}_${m}`;
  }).join(",\n            ");

  return `
    WITH live AS (
        SELECT ${liveCols}
        FROM TBTR_SALESBULANAN a
        LEFT JOIN tbmaster_prodmast p ON a.SLS_PRDCD = p.PRD_PRDCD
        LEFT JOIN tbmaster_stock b
               ON a.SLS_PRDCD = b.ST_PRDCD AND b.ST_LOKASI = '01'
    ),
    ${rekapCtes},
    mtd AS (${mtdMargin})
    SELECT  ${vPrev},
            ${vCur}
    FROM live l
    CROSS JOIN rekap0 r0
    CROSS JOIN rekap1 r1
  `;
};
