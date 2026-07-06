// src/utils/query/inventory/master-lokasi-query.ts

const getLastThreeMonths = (): string[] => {
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const months: number[] = [];

  for (let i = 3; i >= 1; i--) {
    let m = currentMonth - i;
    if (m <= 0) m += 12;
    months.push(m);
  }

  return months.map((m) => m.toString().padStart(2, "0"));
};

export const MasterLokasiQuery = () //   conditions: string,
//   params: QueryParam[],
: string => {
  const [m1, m2, m3] = getLastThreeMonths();
  const avgExpr = `(COALESCE(RSL_QTY_${m1},0)+COALESCE(RSL_QTY_${m2},0)+COALESCE(RSL_QTY_${m3},0))/3`;

  return `
        SELECT 
            alamat, 
            Jenis,
            PRD_KODEDIVISI,
            PRD_PRDCD,
            PRD_DESKRIPSIPANJANG,
            PRD_FRAC,
            PRD_KODETAG,
            plano,
            LPP,
            ACOST,
            PKM_PKMT,
            AVG_REG,
            AVG_MM,
            HGB_KODESUPPLIER,
            sup_namasupplier,
            LKS_MAXDISPLAY,
            LKS_MAXPLANO,
            LKS_MINPCT ,
            LKS_EXPDATE,
            MAXPALET
            FROM TBMASTER_PRODMAST
            LEFT JOIN (
            SELECT LKS_PRDCD, lks_koderak||'.'||lks_kodesubrak||'.'||lks_tiperak||'.'||lks_shelvingrak||'.'||LKS_NOURUT  alamat,    
            LKS_jenisrak Jenis,lks_qty  plano,LKS_MAXDISPLAY,LKS_MAXPLANO,LKS_MINPCT,LKS_EXPDATE from tbmaster_lokasi) sub1 ON PRD_PRDCD=LKS_PRDCD
            LEFT JOIN (
            select hgb_prdcd,hgb_tipe,HGB_KODESUPPLIER,sup_namasupplier
            from tbmaster_hargabeli
            left join tbmaster_supplier on hgb_kodesupplier=sup_kodesupplier 
            where hgb_tipe='2') sub2 ON PRD_PRDCD=HGB_PRDCD
            LEFT JOIN (
            select
            ST_PRDCD,
            ST_SALDOAKHIR AS LPP, 
            ST_AVGCOST AS ACOST,
            PKM_PKMT,
            MPT_MAXQTY AS MAXPALET,
            AVG_REG,
            AVG_MM
            from tbmaster_stock 
            LEFT JOIN TBMASTER_KKPKM ON ST_PRDCD=PKM_PRDCD
            LEFT JOIN TBMASTER_MAXPALET ON ST_PRDCD=MPT_PRDCD
            LEFT JOIN (
                SELECT RSL_PRDCD,
                    ROUND(COALESCE(SUM(CASE WHEN RSL_GROUP='01' THEN ${avgExpr} END), 0)) AS AVG_REG,
                    ROUND(COALESCE(SUM(CASE WHEN RSL_GROUP='03' THEN ${avgExpr} END), 0)) AS AVG_MM
                FROM TBTR_REKAPSALESBULANAN
                WHERE RSL_LOKASI='01' AND RSL_GROUP IN ('01','03')
                GROUP BY RSL_PRDCD
            ) sub5 ON ST_PRDCD=RSL_PRDCD
            where st_lokasi='01') sub7 ON PRD_PRDCD=ST_PRDCD
            WHERE PRD_PRDCD LIKE'%0' AND LPP IS NOT NULL ORDER BY ALAMAT ASC
    `;
};
