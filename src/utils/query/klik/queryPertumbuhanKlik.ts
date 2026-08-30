// src/utils/query/klik/queryPertumbuhanKlik.ts
// Pertumbuhan Klik: omzet (net) & margin per bulan, sumber gabungan
// tbtr_jualdetail + tbtr_jualdetail_interface, join header OBI + customer + produk.
// net & margin mengikuti query referensi PHP (pemisahan PPN 11%, tanda mengikuti
// tipe transaksi, HPP = baseprice × qty, qty dibagi frac bila unit KG).
// Filter: obi_recid='6', exclude TMI, bukan jenismember 'T'; cus_flagmemberkhusus
// TIDAK difilter (di-comment di referensi).
// `conditions` menyisipkan rentang trjd_transactiondate + skiplist member.

const NET_CASE = `
  CASE
    WHEN t.trjd_flagtax2 LIKE 'Y%' AND t.trjd_transactiontype = 'S'
       THEN (t.trjd_nominalamt / 111) * 100
    WHEN t.trjd_flagtax2 LIKE 'Y%' AND t.trjd_transactiontype = 'R'
       THEN ((t.trjd_nominalamt / 111) * 100) * -1
    WHEN t.trjd_flagtax2 = 'Y' AND t.trjd_transactiontype = 'S'
       THEN t.trjd_nominalamt
    ELSE (t.trjd_nominalamt) * -1
  END`;

const MARGIN_CASE = `
  CASE
    WHEN t.trjd_flagtax2 LIKE 'Y%' AND t.trjd_transactiontype = 'S' AND prd.prd_unit = 'KG'
       THEN ((t.trjd_nominalamt / 111) * 100) - (t.trjd_baseprice * (t.trjd_quantity / prd.prd_frac))
    WHEN t.trjd_flagtax2 LIKE 'Y%' AND t.trjd_transactiontype = 'S' AND prd.prd_unit <> 'KG'
       THEN ((t.trjd_nominalamt / 111) * 100) - (t.trjd_baseprice * t.trjd_quantity)
    WHEN t.trjd_flagtax2 LIKE 'Y%' AND t.trjd_transactiontype = 'R' AND prd.prd_unit = 'KG'
       THEN (((t.trjd_nominalamt / 111) * 100) - (t.trjd_baseprice * (t.trjd_quantity / prd.prd_frac))) * -1
    WHEN t.trjd_flagtax2 LIKE 'Y%' AND t.trjd_transactiontype = 'R' AND prd.prd_unit <> 'KG'
       THEN (((t.trjd_nominalamt / 111) * 100) - (t.trjd_baseprice * t.trjd_quantity)) * -1
    WHEN t.trjd_flagtax2 <> 'Y' AND t.trjd_transactiontype = 'S' AND prd.prd_unit = 'KG'
       THEN (t.trjd_nominalamt) - (t.trjd_baseprice * (t.trjd_quantity / prd.prd_frac))
    WHEN t.trjd_flagtax2 <> 'Y' AND t.trjd_transactiontype = 'S' AND prd.prd_unit <> 'KG'
       THEN (t.trjd_nominalamt) - (t.trjd_baseprice * t.trjd_quantity)
    WHEN t.trjd_flagtax2 <> 'Y' AND t.trjd_transactiontype = 'R' AND prd.prd_unit = 'KG'
       THEN ((t.trjd_nominalamt) - (t.trjd_baseprice * (t.trjd_quantity / prd.prd_frac))) * -1
    ELSE ((t.trjd_nominalamt) - (t.trjd_baseprice * t.trjd_quantity)) * -1
  END`;

export const queryPertumbuhanKlik = (conditions: string): string => `
  SELECT
    to_char(tgl, 'yyyy-mm') AS bulan,
    round(SUM(net), 2)::float8 AS nett,
    round(SUM(margin), 2)::float8 AS margin
  FROM
    (
      SELECT
        date_trunc('month', t.trjd_transactiondate) AS tgl,
        (${NET_CASE}) AS net,
        (${MARGIN_CASE}) AS margin
      FROM (
        SELECT DISTINCT
          trjd_transactiondate, trjd_cus_kodemember, trjd_cashierstation,
          trjd_transactionno, trjd_create_by, trjd_prdcd, trjd_flagtax2,
          trjd_flagtax1, trjd_transactiontype, trjd_nominalamt, trjd_quantity,
          trjd_baseprice
        FROM TBTR_JUALDETAIL
        WHERE trjd_recordid IS NULL
        UNION ALL
        SELECT DISTINCT
          trjd_transactiondate, trjd_cus_kodemember, trjd_cashierstation,
          trjd_transactionno, trjd_create_by, trjd_prdcd, trjd_flagtax2,
          trjd_flagtax1, trjd_transactiontype, trjd_nominalamt, trjd_quantity,
          trjd_baseprice
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
      LEFT JOIN tbmaster_prodmast prd ON prd.prd_prdcd = t.trjd_prdcd
      WHERE h.obi_recid = '6'
        AND t.trjd_transactiondate IS NOT NULL
        AND h.obi_attribute2 <> 'TMI'
        AND coalesce(cus.cus_jenismember, '0') <> 'T'
        ${conditions ? `AND ${conditions}` : ""}
      GROUP BY
        trjd_create_by || trjd_cashierstation || trjd_transactionno,
        trjd_transactiondate,
        trjd_flagtax2,
        trjd_flagtax1,
        trjd_transactiontype,
        trjd_nominalamt,
        prd.prd_unit,
        trjd_baseprice,
        trjd_quantity,
        prd.prd_frac,
        trjd_prdcd
    ) sub1
  GROUP BY to_char(tgl, 'yyyy-mm')
`;
