// src/utils/query/queryTrendSalesByMember.ts
import { SQL_NETTO } from "@/utils/sql";

export const QueryTrendSalesByMember = (plu?: string) => {
  const filterPlu = plu
    ? `AND substr(trjd_prdcd, 1, 6) || '0' = $1`
    : "";

  return `
    SELECT
      to_char(dtl_tanggal, 'mon') AS bln,
      EXTRACT(MONTH FROM dtl_tanggal) AS bln_angka,
      ROUND(SUM(CASE WHEN dtl_tipemember = 'REGULER' THEN dtl_qty_pcs ELSE 0 END)) AS qty_mb,
      ROUND(SUM(CASE WHEN dtl_tipemember = 'REGULER' THEN dtl_netto ELSE 0 END)) AS netto_mb,
      ROUND(SUM(CASE WHEN dtl_tipemember IN ('KHUSUS', 'TMI') THEN dtl_qty_pcs ELSE 0 END)) AS qty_mm,
      ROUND(SUM(CASE WHEN dtl_tipemember IN ('KHUSUS', 'TMI') THEN dtl_netto ELSE 0 END)) AS netto_mm,
      ROUND(SUM(CASE WHEN dtl_tipemember = 'OMI' THEN dtl_qty_pcs ELSE 0 END)) AS qty_omi,
      ROUND(SUM(CASE WHEN dtl_tipemember = 'OMI' THEN dtl_netto ELSE 0 END)) AS netto_omi,
      ROUND(SUM(CASE WHEN dtl_tipemember = 'IDM' THEN dtl_qty_pcs ELSE 0 END)) AS qty_idm,
      ROUND(SUM(CASE WHEN dtl_tipemember = 'IDM' THEN dtl_netto ELSE 0 END)) AS netto_idm
    FROM (
      SELECT
        date_trunc('day', trjd_transactiondate) AS dtl_tanggal,
        CASE
          WHEN cus_jenismember = 'T' THEN 'TMI'
          WHEN cus_flagmemberkhusus = 'Y' THEN 'KHUSUS'
          WHEN trjd_create_by IN ('IDM', 'ID1', 'ID2') THEN 'IDM'
          WHEN trjd_create_by IN ('OMI', 'BKL') THEN 'OMI'
          ELSE 'REGULER'
        END AS dtl_tipemember,
        CASE
          WHEN prd_unit = 'KG' AND prd_frac = 1000 THEN trjd_quantity / prd_frac
          ELSE trjd_quantity * prd_frac
        END AS dtl_qty_pcs,
        CASE
          WHEN trjd_transactiontype = 'R' THEN ${SQL_NETTO} * -1
          ELSE ${SQL_NETTO}
        END AS dtl_netto
      FROM (
        SELECT
          trjd_prdcd, trjd_flagtax1, trjd_flagtax2,
          trjd_quantity, trjd_nominalamt,
          trjd_divisioncode, trjd_division,
          trjd_cus_kodemember, trjd_create_by, trjd_modify_by,
          trjd_transactiondate, trjd_transactiontype
        FROM tbtr_jualdetail
        WHERE trjd_transactiontype = 'S'
          ${filterPlu}
          AND date_trunc('mon', trjd_transactiondate) >= date_trunc('mon', CURRENT_DATE - INTERVAL '11 months')
        UNION ALL
        SELECT
          trjd_prdcd, trjd_flagtax1, trjd_flagtax2,
          trjd_quantity, trjd_nominalamt,
          trjd_divisioncode, trjd_division,
          trjd_cus_kodemember, trjd_create_by, trjd_modify_by,
          trjd_transactiondate, trjd_transactiontype
        FROM tbtr_jualdetail_interface
        WHERE trjd_transactiontype = 'S'
          ${filterPlu}
          AND date_trunc('mon', trjd_transactiondate) >= date_trunc('mon', CURRENT_DATE - INTERVAL '11 months')
      ) trjd
      LEFT JOIN tbmaster_prodmast ON trjd_prdcd = prd_prdcd
      LEFT JOIN tbmaster_tokoigr ON trjd_cus_kodemember = tko_kodecustomer
      LEFT JOIN tbmaster_customer ON trjd_cus_kodemember = cus_kodemember
    ) dtl
    GROUP BY bln, bln_angka
    ORDER BY bln_angka
  `;
};
