// src/utils/query/queryTrendSalesByDivisi.ts

const MONTHS = [
  "01", "02", "03", "04", "05", "06",
  "07", "08", "09", "10", "11", "12",
] as const;

// ponytail: arsip tahun lalu = <tahun sekarang −1>, snapshot bulan 12.
// Kalau arsipnya belum ada (awal Januari sebelum job jalan), query akan gagal.
const REKAP_TABLE = `tbtr_rekapsalesbulanan_${new Date().getFullYear() - 1}_12`;

export const QueryTrendSalesByDivisi = () => {
  const cur = String(new Date().getMonth() + 1).padStart(2, "0");

  // Tahun ini: TBTR_SALESBULANAN (prefix sls_), bulan berjalan live dari
  // TBMASTER_STOCK (st_sales × st_avgcost) karena belum terisi.
  // Tahun lalu: tabel arsip rekap (prefix rsl_, kolom divisi sudah ada).
  const liveRph = MONTHS.map((m) =>
    m === cur
      ? `COALESCE(SUM(CASE WHEN p.PRD_UNIT = 'KG' AND p.PRD_FRAC = 1000
                THEN (b.ST_SALES * b.ST_AVGCOST) / p.PRD_FRAC
                ELSE b.ST_SALES * b.ST_AVGCOST END), 0) AS sls_rph_${m}`
      : `COALESCE(SUM(a.SLS_RPH_${m}), 0) AS sls_rph_${m}`,
  ).join(",\n            ");
  const liveMgr = MONTHS.map(
    (m) => `COALESCE(SUM(a.SLS_RPH_${m} - a.SLS_HPP_${m}), 0) AS mgr_${m}`,
  ).join(",\n            ");

  const rekapRph = MONTHS.map(
    (m) => `COALESCE(SUM(a.RSL_RPH_${m}), 0) AS sls_rph_${m}`,
  ).join(",\n            ");
  const rekapMgr = MONTHS.map(
    (m) => `COALESCE(SUM(a.RSL_RPH_${m} - a.RSL_HPP_${m}), 0) AS mgr_${m}`,
  ).join(",\n            ");

  return `
    WITH live AS (
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
        GROUP BY p.prd_kodedivisi
    ),
    rekap AS (
        SELECT  a.rsl_kodedivisi                              AS kodedivisi,
                MAX(d.div_namadivisi)                         AS namadivisi,
                ${rekapRph},
                ${rekapMgr}
        FROM    ${REKAP_TABLE} a
        LEFT JOIN tbmaster_divisi d
               ON a.rsl_kodedivisi = d.div_kodedivisi
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
