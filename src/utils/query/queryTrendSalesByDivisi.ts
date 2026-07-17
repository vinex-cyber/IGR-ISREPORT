// src/utils/query/queryTrendSalesByDivisi.ts

const MONTHS = [
  "01", "02", "03", "04", "05", "06",
  "07", "08", "09", "10", "11", "12",
] as const;

export const QueryTrendSalesByDivisi = () => {
  const selectRph = MONTHS.map(
    (m) => `COALESCE(SUM(a.SLS_RPH_${m}), 0) AS sls_rph_${m}`,
  ).join(",\n            ");

  const selectMgr = MONTHS.map(
    (m) =>
      `COALESCE(SUM(a.SLS_RPH_${m} - a.SLS_HPP_${m}), 0) AS mgr_${m}`,
  ).join(",\n            ");

  return `
    SELECT  p.prd_kodedivisi                                  AS kodedivisi,
            d.div_namadivisi                                  AS namadivisi,
            ${selectRph},
            ${selectMgr}
    FROM    TBTR_SALESBULANAN a
    LEFT JOIN tbmaster_prodmast p
           ON a.SLS_PRDCD = p.PRD_PRDCD
    LEFT JOIN tbmaster_divisi d
           ON p.prd_kodedivisi = d.div_kodedivisi
    GROUP BY p.prd_kodedivisi, d.div_namadivisi
    ORDER BY p.prd_kodedivisi
  `;
};
