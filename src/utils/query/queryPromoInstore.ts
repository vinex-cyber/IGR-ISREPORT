export const QueryPromoInstore = (conditions: string) => {
  return `
    SELECT isd_prdcd,
    isd_kodepromosi,
    CASE WHEN isd_jenispromosi = 'H' THEN 'G' ELSE 'I' END AS isd_jenispromosi,
    ish_tglawal,
    ish_tglakhir,
    isd_minpcs,
    CASE WHEN isd_jenispromosi = 'I' THEN isd_minrph ELSE ish_minsponsor END AS isd_minrph,
    ish_minstruk,
    ish_prdcdhadiah,
    bprp_ketpanjang,
    ish_jmlhadiah,
    ish_kelipatanhadiah,
    ish_qtyalokasi,
    ish_qtyalokasiout,
    ish_reguler,
    ish_regulerbiruplus,
    ish_freepass,
    ish_retailer,
    ish_silver,
    ish_gold1,
    ish_gold2,
    ish_gold3,
    ish_platinum
    FROM tbtr_instore_dtl
    LEFT JOIN tbtr_instore_hdr ON isd_kodepromosi = ish_kodepromosi
    LEFT JOIN tbmaster_brgpromosi ON ish_prdcdhadiah = bprp_prdcd
    LEFT JOIN (SELECT * FROM tbmaster_prodmast WHERE prd_prdcd LIKE '%0') prd ON bprp_ketpanjang = prd_deskripsipanjang
    WHERE current_date BETWEEN date(ish_tglawal) AND date(ish_tglakhir)
    ${conditions}
  `;
};
