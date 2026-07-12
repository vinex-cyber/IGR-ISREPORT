export const QueryPromoGift = (conditions: string) => {
  return `
                  select
                    d.gfd_prdcd            AS gif_prdcd,
                    d.gfd_kodepromosi AS gif_kode_promosi,
                    h.gfh_namapromosi      AS gif_nama_promosi,  
                    d.gfd_pcs              AS gif_min_beli_pcs,
                    d.gfd_rph              AS gif_min_beli_rph,
                    TO_CHAR(H.GFH_TGLAWAL,'DD-MON-YY')        AS gif_mulai,
                    TO_CHAR(H.GFH_TGLAKHIR,'DD-MON-YY')         AS gif_selesai,
                    h.gfh_jenispromosi     AS gif_jenis_promosi,
                    h.gfh_mintotbelanja    AS gif_min_total_struk,
                    h.gfh_mintotsponsor    as gif_min_total_sponsor,
                    h.gfh_maxjmlhari       as gif_max_jml_hari,
                    h.gfh_maxfrekhari       as gif_max_frek_hari,
                    h.gfh_maxjmlevent       as gif_max_jml_event,
                    h.GFH_MAXFREKEVENT      as gif_max_frek_event,
                    h.gfh_jenishadiah      AS gif_jenis_hadiah,
                    h.gfh_kethadiah        AS gif_plu_hadiah,
                    p.prd_deskripsipanjang AS gif_nama_hadiah,
                    h.gfh_jmlhadiah        AS gif_jumlah_hadiah,
                    a.gfa_reguler          AS gif_reguler,
                    a.gfa_reguler_biruplus AS gif_reguler_biruplus,
                    a.gfa_freepass         AS gif_freepass,
                    a.gfa_retailer         AS gif_retailer,
                    a.gfa_silver           AS gif_silver,
                    a.gfa_gold1            AS gif_gold1,
                    a.gfa_gold2            AS gif_gold2,
                    a.gfa_gold3            AS gif_gold3,
                    a.gfa_platinum         AS gif_platinum,
 					          TO_CHAR(H.GFH_TGLAKHIR,'DD-MON-YY') AS GFH_TGLAKHIR, 
                    H.GFH_FLAGIGR AS GFH_FLAGIGR,
                    H.GFH_FLAGKLIK AS GFH_FLAGKLIK,
                    H.GFH_FLAGSPI AS GFH_FLAGSPI,
                    H.GFH_FLAGTMI AS GFH_FLAGTMI
                  FROM tbtr_gift_dtl d
                  LEFT JOIN tbtr_gift_hdr h ON d.gfd_kodepromosi = h.gfh_kodepromosi
                  LEFT JOIN tbtr_gift_alokasi a ON d.gfd_kodepromosi = a.gfa_kodepromosi
                  LEFT JOIN tbmaster_prodmast p ON h.gfh_kethadiah = p.prd_prdcd
                  WHERE CURRENT_DATE BETWEEN DATE_TRUNC('day', h.gfh_tglawal) AND DATE_TRUNC('day', h.gfh_tglakhir) AND H.GFH_RECORDID IS NULL
                  ${conditions}
    `;
};
