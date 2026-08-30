// src/utils/query/klik/querySalesKlik.ts
// Sales Klik per hari (omzet net tanpa TMI) — sumber gabungan tbtr_jualdetail +
// tbtr_jualdetail_interface (pola UNION ALL + DISTINCT sama seperti queryTodaySales),
// join header OBI + customer.
// net dihitung dari trjd_nominalamt dgn pemisahan PPN 11% (flagtax2 LIKE 'Y%' → bagi
// 111*100), tanda mengikuti transactiontype (S positif, R negatif).
// Filter: obi_recid='6', exclude TMI (obi_attribute2<>'TMI'), bukan jenismember 'T'.
// cus_flagmemberkhusus TIDAK difilter (di-comment di query referensi) — angka match
// (mis. tgl 29/08 = 167.874.636,82).
// `conditions` (dari filter sales) menyisipkan rentang `trjd_transactiondate >= $1 AND < $2`.
export const querySalesKlik = (conditions: string): string => `
  SELECT
    to_char(tgl, 'dd-mm-yyyy') AS tgl,
    round(SUM(net), 2)::float8 AS nett
  FROM
    (
      SELECT
        date_trunc('day', t.trjd_transactiondate) AS tgl,
        (
          CASE
            WHEN t.trjd_flagtax2 LIKE 'Y%' AND t.trjd_transactiontype = 'S'
               THEN (t.trjd_nominalamt / 111) * 100
            WHEN t.trjd_flagtax2 LIKE 'Y%' AND t.trjd_transactiontype = 'R'
               THEN ((t.trjd_nominalamt / 111) * 100) * -1
            WHEN t.trjd_flagtax2 = 'Y' AND t.trjd_transactiontype = 'S'
               THEN t.trjd_nominalamt
            ELSE (t.trjd_nominalamt) * -1
          END
        ) AS net
      FROM (
        SELECT DISTINCT
          trjd_transactiondate, trjd_cus_kodemember, trjd_cashierstation,
          trjd_transactionno, trjd_create_by, trjd_prdcd, trjd_flagtax2,
          trjd_flagtax1, trjd_transactiontype, trjd_nominalamt
        FROM TBTR_JUALDETAIL
        WHERE trjd_recordid IS NULL
        UNION ALL
        SELECT DISTINCT
          trjd_transactiondate, trjd_cus_kodemember, trjd_cashierstation,
          trjd_transactionno, trjd_create_by, trjd_prdcd, trjd_flagtax2,
          trjd_flagtax1, trjd_transactiontype, trjd_nominalamt
        FROM tbtr_jualdetail_interface
        WHERE trjd_recordid IS NULL
      ) t
      JOIN tbtr_obi_h h
        ON h.obi_kdmember = t.trjd_cus_kodemember
       AND h.obi_kdstation = t.trjd_cashierstation
       AND date_trunc('day', h.obi_tglstruk) = date_trunc('day', t.trjd_transactiondate)
       AND h.obi_nostruk = t.trjd_transactionno
       AND h.obi_modifyby = t.trjd_create_by
      LEFT JOIN tbmaster_customer cus ON cus.cus_kodemember = t.trjd_cus_kodemember
      WHERE h.obi_recid = '6'
        AND t.trjd_transactiondate IS NOT NULL
        AND h.obi_attribute2 <> 'TMI'
        AND coalesce(cus.cus_jenismember, '0') <> 'T'
        ${conditions ? `AND ${conditions}` : ""}
    ) sub1
  GROUP BY to_char(tgl, 'dd-mm-yyyy')
`;
