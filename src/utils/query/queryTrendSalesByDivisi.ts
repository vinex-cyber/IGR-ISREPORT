// src/utils/query/queryTrendSalesByDivisi.ts

const MONTHS = [
  "01", "02", "03", "04", "05", "06",
  "07", "08", "09", "10", "11", "12",
] as const;

import { JUALDETAIL_DISTINCT_BASE } from "@/utils/query/jualdetailBase";

// Tren divisi: tahun ini dari TBTR_SALESBULANAN (sls_) + bulan berjalan live
// dari TBMASTER_STOCK, tahun lalu dari tabel arsip rekap bulanan (rsl_).
// rekapTable di-resolve server-side (information_schema) karena tidak semua
// branch punya snapshot arsip yang sama; null → tanpa rekap (kolom kosong).
export const QueryTrendSalesByDivisi = (
  rekapTable: string | null,
  divisi?: string,
) => {
  const cur = String(new Date().getMonth() + 1).padStart(2, "0");
  const divisiCond = divisi ? ` AND p.prd_kodedivisi = $1 ` : "";
  const rekapDivisiCond = divisi ? ` AND a.rsl_kodedivisi = $1 ` : "";
  const mtdDivisiCond = divisi ? ` AND trim(x.dtl_k_div) = $1 ` : "";

  const liveRph = MONTHS.map((m) =>
    m === cur
      ? `COALESCE(SUM(CASE WHEN p.PRD_UNIT = 'KG' AND p.PRD_FRAC = 1000
                THEN (b.ST_SALES * b.ST_AVGCOST) / p.PRD_FRAC
                ELSE b.ST_SALES * b.ST_AVGCOST END), 0) AS sls_rph_${m}`
      : `COALESCE(SUM(a.SLS_RPH_${m}), 0) AS sls_rph_${m}`,
  ).join(",\n            ");

  // Margin bulan berjalan dihitung live dari transaksi MTD, menyamai granularity
  // DISTINCT dan formula netto-hpp dari DetailStruk (report evaluasi sales per bulan).
  // salesbulanan belum diisi job untuk bulan berjalan (selalu ngajar 0)
  const baseCols = JUALDETAIL_DISTINCT_BASE;
  const liveMgr = MONTHS.map(
    (m) =>
      m === cur
        ? `COALESCE((SELECT mm.mgr_cur FROM mtd mm
            WHERE COALESCE(mm.kodedivisi, '~') = COALESCE(p.prd_kodedivisi, '~')), 0)::float8 AS mgr_${m}`
        : `COALESCE(SUM(a.SLS_RPH_${m} - a.SLS_HPP_${m}), 0) AS mgr_${m}`,
  ).join(",\n            ");

  const mtdMargin = `
    SELECT trim(x.dtl_k_div) AS kodedivisi,
           COALESCE(SUM(
             CASE WHEN x.dtl_rtype = 'S' THEN x.dtl_netto - x.dtl_hpp
                  ELSE (x.dtl_netto - x.dtl_hpp) * -1 END), 0)::float8 AS mgr_cur
    FROM (
      SELECT t.trjd_transactiontype AS dtl_rtype,
             t.trjd_divisioncode AS dtl_k_div,
             CASE WHEN t.trjd_flagtax2 = 'Y' AND t.trjd_create_by NOT IN ('IDM', 'OMI', 'BKL')
                  THEN t.trjd_nominalamt / 1.11 ELSE t.trjd_nominalamt END AS dtl_netto,
             CASE WHEN prd.prd_unit = 'KG'
                  THEN t.trjd_quantity * t.trjd_baseprice / 1000
                  ELSE t.trjd_quantity * t.trjd_baseprice END AS dtl_hpp
      FROM (
        SELECT DISTINCT ${baseCols}
        FROM (
          SELECT ${baseCols}
          FROM tbtr_jualdetail
          WHERE trjd_transactiondate >= date_trunc('month', now())
            AND trjd_recordid IS NULL AND trjd_quantity <> 0
          UNION ALL
          SELECT ${baseCols}
          FROM tbtr_jualdetail_interface
          WHERE trjd_transactiondate >= date_trunc('month', now())
            AND trjd_recordid IS NULL AND trjd_quantity <> 0
        ) s
      ) t
      LEFT JOIN tbmaster_prodmast prd ON t.trjd_prdcd = prd.prd_prdcd
      WHERE t.trjd_quantity <> 0
    ) x
    WHERE 1 = 1${mtdDivisiCond}
    GROUP BY trim(dtl_k_div)
  `;

  const rekapSource = rekapTable
    ? `${rekapTable} a`
    : "(SELECT NULL::varchar AS rsl_kodedivisi WHERE FALSE) a";
  const rekapRph = MONTHS.map((m) =>
    rekapTable
      ? `COALESCE(SUM(a.RSL_RPH_${m}), 0) AS sls_rph_${m}`
      : `NULL AS sls_rph_${m}`,
  ).join(",\n            ");
  const rekapMgr = MONTHS.map((m) =>
    rekapTable
      ? `COALESCE(SUM(a.RSL_RPH_${m} - a.RSL_HPP_${m}), 0) AS mgr_${m}`
      : `NULL AS mgr_${m}`,
  ).join(",\n            ");
  const rekapJoin = `
        LEFT JOIN tbmaster_divisi d
               ON a.rsl_kodedivisi = d.div_kodedivisi`;

  return `
    WITH mtd AS (${mtdMargin}),
    live AS (
        SELECT  p.prd_kodedivisi                              AS kodedivisi,
                MAX(d.div_namadivisi)                         AS namadivisi,
                ${liveRph},
                ${liveMgr}
        FROM    TBTR_SALESBULANAN a
        LEFT JOIN tbmaster_prodmast p
               ON a.SLS_PRDCD = p.PRD_PRDCD
        LEFT JOIN tbmaster_stock b
               ON a.SLS_PRDCD = b.ST_PRDCD AND b.ST_LOKASI = '01'
        LEFT JOIN tbmaster_divisi d
               ON p.prd_kodedivisi = d.div_kodedivisi
        WHERE 1 = 1${divisiCond}
        GROUP BY p.prd_kodedivisi
    ),
    rekap AS (
        SELECT  a.rsl_kodedivisi                              AS kodedivisi,
                MAX(d.div_namadivisi)                         AS namadivisi,
                ${rekapRph},
                ${rekapMgr}
        FROM    ${rekapSource}
        ${rekapJoin}
        WHERE 1 = 1${rekapDivisiCond}
        GROUP BY a.rsl_kodedivisi
    )
    SELECT  COALESCE(l.kodedivisi, r.kodedivisi)              AS kodedivisi,
            COALESCE(l.namadivisi, r.namadivisi)              AS namadivisi,
            ${MONTHS.map((m) => (m <= cur ? `l.sls_rph_${m}` : `r.sls_rph_${m}`)).join(",\n            ")},
            ${MONTHS.map((m) => (m <= cur ? `l.mgr_${m}` : `r.mgr_${m}`)).join(",\n            ")}
    FROM    live l
    FULL OUTER JOIN rekap r
           ON COALESCE(l.kodedivisi, '~') = COALESCE(r.kodedivisi, '~')
    ORDER BY 1
  `;
};
