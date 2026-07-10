export const QueryTrendSales = (plu?: string) => {
  const filterPlu = plu ? `WHERE a.SLS_PRDCD = '${plu}'` : "";

  return `
        SELECT a.*,
            b.st_sales,
            CASE
                WHEN p.PRD_UNIT = 'KG' AND p.PRD_FRAC = 1000
                    THEN (b.ST_SALES * b.ST_AVGCOST) / p.PRD_FRAC
                ELSE b.ST_SALES * b.ST_AVGCOST
            END AS HPP
        FROM TBTR_SALESBULANAN a
        LEFT JOIN TBMASTER_STOCK b ON a.SLS_PRDCD = b.ST_PRDCD AND b.ST_LOKASI = '01'
        LEFT JOIN tbmaster_prodmast p ON a.SLS_PRDCD = p.PRD_PRDCD
        ${filterPlu}
    `;
};
