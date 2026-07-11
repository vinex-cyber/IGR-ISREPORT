// /src/utils/query/queryPromoCashback.ts
export const QueryPromoCashback = (conditions: string) => {
  return `
SELECT DISTINCT cbd_prdcd,
  prd_prdcd,
  cbd_kodepromosi,
  cbh_namapromosi,
  cbd_minstruk,
  cbh_minrphprodukpromo,
  cbh_mintotbelanja,
  cbd_cashback,
  alokasi,
  cbk_sisa alokasi_keluar,
  alokasi - cbk_sisa cbk_sisa,
  cbd_maxstruk,
  cbd_maxmemberperhari,
  cbd_maxfrekperevent,
  cbd_maxrphperevent,
  cbd_alokasistok,
  to_char(cbh_tglawal, 'DD-MON-YY') cbh_tglawal,
  to_char(cbh_tglakhir, 'DD-MON-YY') cbh_tglakhir,
  cbd_flagkelipatan,
  cba_reguler,
  cba_reguler_biruplus,
  cba_freepass,
  cba_retailer,
  cba_silver,
  cba_gold1,
  cba_gold2,
  cba_gold3,
  cba_platinum,
  cbh_flagigr,
  cbh_flagklik,
  cbh_flagspi,
  cbh_flagtmi
FROM
  (SELECT cbd_prdcd,
    prd_prdcd,
    cbd_kodepromosi,
    cbh_namapromosi,
    cbd_minstruk,
    cbh_minrphprodukpromo,
    cbh_mintotbelanja,
    CASE
      WHEN COALESCE(cbd_cashback, 0) = 0
      THEN cbh_cashback
      ELSE cbd_cashback
    END AS CBD_CASHBACK,
    CASE
      WHEN CBA_ALOKASIJUMLAH='0'
      THEN '99999999'
      ELSE (CBA_ALOKASIJUMLAH)
    END AS alokasi,
    COALESCE(cbk_cashback_qty,0) cbk_sisa,
    cbd_maxstruk,
    cbd_maxmemberperhari,
    cbd_maxfrekperevent,
    cbd_maxrphperevent,
    CBD_ALOKASISTOK,
    cbh_tglawal,
    cbh_tglakhir,
    cbd_flagkelipatan,
    cba_reguler,
    cba_reguler_biruplus,
    cba_freepass,
    cba_retailer,
    cba_silver,
    cba_gold1,
    cba_gold2,
    cba_gold3,
    cba_platinum,
    cbh_flagigr,
    cbh_flagklik,
    cbh_flagspi,
    cbh_flagtmi
  FROM tbtr_cashback_dtl d
  LEFT JOIN tbtr_cashback_hdr h
  ON d.cbd_kodepromosi = h.cbh_kodepromosi
  LEFT JOIN tbtr_cashback_alokasi a
  ON d.cbd_kodepromosi = a.cba_kodepromosi
  LEFT JOIN
    (SELECT kd_promosi AS cbk_kodepromosi,
      SUM(kelipatan)   AS cbk_cashback_qty
    FROM m_promosi_h
    GROUP BY kd_promosi
    ) k
  ON d.cbd_kodepromosi = k.cbk_kodepromosi
  left join tbmaster_prodmast on cbd_prdcd = prd_prdcd
 WHERE CURRENT_DATE BETWEEN DATE_TRUNC('day', h.cbh_tglawal) AND DATE_TRUNC('day', h.cbh_tglakhir)
  AND CBH_RECORDID IS NULL
  )s
${conditions}
    `;
};
