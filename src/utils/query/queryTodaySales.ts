// src/utils/query/queryTodaySales.ts
// Base detail sales hari ini + wrapper agregasi per member / per divisi.
// ponytail: satu sumber data supaya total kedua card SELALU konsisten;
// kalau butuh detail tambahan (supplier, virtual payment), pakai DetailStruk.

const BASE_DETAIL = `
SELECT
  CASE
    WHEN dtl_memberkhusus = 'Y' THEN 'MEMBER MERAH'
    WHEN dtl_memberkhusus IS NULL AND dtl_outlet = '6'
         AND dtl_kasir NOT IN ('IDM', 'OMI', 'BKL') THEN 'END USER'
    WHEN dtl_cusno IN (
      SELECT tko_kodecustomer FROM tbmaster_tokoigr WHERE tko_kodesbu = 'I'
    ) THEN 'IDM'
    WHEN dtl_cusno IN (
      SELECT tko_kodecustomer FROM tbmaster_tokoigr WHERE tko_kodesbu = 'O'
    ) THEN 'OMI'
    ELSE 'OTHER'
  END AS jenis_member,
  COALESCE(div.div_namadivisi, sls.trjd_divisioncode) AS namadivisi,
  sls.dtl_rtype,
  sls.dtl_cusno,
  sls.dtl_struk,
  sls.dtl_prdcd_ctn,
  sls.dtl_qty_pcs,
  CASE WHEN sls.dtl_rtype = 'S' THEN sls.dtl_gross ELSE sls.dtl_gross * -1 END AS dtl_gross,
  CASE WHEN sls.dtl_rtype = 'S' THEN sls.dtl_netto ELSE sls.dtl_netto * -1 END AS dtl_netto,
  CASE WHEN sls.dtl_rtype = 'S' THEN sls.dtl_hpp ELSE sls.dtl_hpp * -1 END AS dtl_hpp,
  CASE WHEN sls.dtl_rtype = 'S' THEN sls.dtl_netto - sls.dtl_hpp
       ELSE (sls.dtl_netto - sls.dtl_hpp) * -1 END AS dtl_margin
FROM (
  SELECT
    t.trjd_transactiontype AS dtl_rtype,
    to_char(t.trjd_transactiondate, 'yyyymmdd')
      || t.trjd_cashierstation || t.trjd_create_by
      || t.trjd_transactionno || t.trjd_transactiontype AS dtl_struk,
    substr(t.trjd_prdcd, 1, 6) || '0' AS dtl_prdcd_ctn,
    t.trjd_prdcd,
    t.trjd_divisioncode,
    t.trjd_create_by AS dtl_kasir,
    t.trjd_cus_kodemember AS dtl_cusno,
    cus.cus_flagmemberkhusus AS dtl_memberkhusus,
    cus.cus_kodeoutlet AS dtl_outlet,
    t.trjd_quantity * prd.prd_frac AS dtl_qty_pcs,
    CASE WHEN t.trjd_flagtax2 = 'Y'
          AND t.trjd_create_by IN ('IDM', 'OMI', 'BKL')
         THEN t.trjd_nominalamt * 1.11
         ELSE t.trjd_nominalamt END AS dtl_gross,
    CASE WHEN t.trjd_flagtax2 = 'Y'
          AND t.trjd_create_by NOT IN ('IDM', 'OMI', 'BKL')
         THEN t.trjd_nominalamt / 1.11
         ELSE t.trjd_nominalamt END AS dtl_netto,
    CASE WHEN prd.prd_unit = 'KG'
         THEN t.trjd_quantity * t.trjd_baseprice / 1000
         ELSE t.trjd_quantity * t.trjd_baseprice END AS dtl_hpp
  FROM (
    SELECT DISTINCT
      trjd_transactiontype, trjd_transactiondate, trjd_prdcd,
      trjd_flagtax2, trjd_quantity, trjd_nominalamt, trjd_baseprice,
      trjd_divisioncode, trjd_division, trjd_recordid, trjd_create_by,
      trjd_cus_kodemember, trjd_cashierstation, trjd_transactionno, trjd_seqno
    FROM TBTR_JUALDETAIL
    WHERE trjd_transactiondate::date = current_date AND trjd_recordid IS NULL
    UNION ALL
    SELECT DISTINCT
      trjd_transactiontype, trjd_transactiondate, trjd_prdcd,
      trjd_flagtax2, trjd_quantity, trjd_nominalamt, trjd_baseprice,
      trjd_divisioncode, trjd_division, trjd_recordid, trjd_create_by,
      trjd_cus_kodemember, trjd_cashierstation, trjd_transactionno, trjd_seqno
    FROM tbtr_jualdetail_interface
    WHERE trjd_transactiondate::date = current_date AND trjd_recordid IS NULL
  ) t
  JOIN tbmaster_prodmast prd ON t.trjd_prdcd = prd.prd_prdcd
  JOIN tbmaster_customer cus ON t.trjd_cus_kodemember = cus.cus_kodemember
  WHERE t.trjd_quantity <> 0
) sls
LEFT JOIN tbmaster_divisi div ON sls.trjd_divisioncode = div.div_kodedivisi
`;

// ponytail: klasifikasi dihitung sebagai angka + label sekaligus supaya
// GROUP BY tinggal pakai tanpa subquery ekstra.
export const TodaySalesByMemberQuery = (): string => `
SELECT
  jenis_member,
  to_char(now(), 'DD-MM-YYYY') AS tanggal,
  count(DISTINCT dtl_cusno) AS jumlah_member,
  count(DISTINCT dtl_struk) AS jumlah_struk,
  count(DISTINCT dtl_prdcd_ctn) AS jumlah_produk,
  trunc(sum(dtl_qty_pcs)) AS total_qty,
  trunc(sum(dtl_gross)) AS total_gross,
  trunc(sum(dtl_netto)) AS total_netto,
  trunc(sum(dtl_margin)) AS total_margin
FROM (${BASE_DETAIL}) agg
GROUP BY jenis_member
ORDER BY jenis_member
`;

export const TodaySalesByDivisiQuery = (): string => `
SELECT
  namadivisi,
  trunc(sum(dtl_netto)) AS netto,
  trunc(sum(dtl_margin)) AS margin,
  count(DISTINCT dtl_prdcd_ctn) AS jumlah_produk
FROM (${BASE_DETAIL}) agg
GROUP BY namadivisi
ORDER BY netto DESC
`;
