// /src/utils/query/queryPromoMendatang.ts
export const QueryPromoMendatang = (conditions: string) => {
  return `
  select * from (
    select
        cbh_kodepromosi             as kd_promo,
        cbh_namapromosi             as nama_promo,
        cbd_prdcd                   as plu_promo,
        to_char(cbh_tglawal, 'DD-MON-YY')               as tglawal_promo,
        to_char(cbh_tglakhir, 'DD-MON-YY')                as tglakhir_promo,
        cbh_flagigr                 as flagigr,
        cbh_flagklik                as flagklik,
        cbh_flagspi                 as flagspi,
        cbh_flagtmi                 as flagtmi,
        cba_reguler                 as mm_reguler,
        cba_reguler_biruplus        as mm_reguler_biruplus,
        cba_retailer                as mm_retailer,
        cba_silver                  as mm_silver,
        cba_gold1                   as mm_gold1,
        cba_gold2                   as mm_gold2,
        cba_gold3                   as mm_gold3,
        cba_platinum                as mm_platinum
    from tbtr_cashback_hdr
    left join tbtr_cashback_dtl on cbh_kodepromosi = cbd_kodepromosi
    left join tbmaster_prodmast on cbd_prdcd = prd_prdcd
    left join tbtr_cashback_alokasi on cbh_kodepromosi = cba_kodepromosi
    where
        cbh_recordid is null
        and cbh_tglawal > current_date

    union all

    select
        gfh_kodepromosi             as kd_promo,
        gfh_namapromosi             as nama_promo,
        gfd_prdcd                   as plu_promo,
        to_char(gfh_tglawal, 'DD-MON-YY')                 as tglawal_promo,
        to_char(gfh_tglakhir, 'DD-MON-YY')                as tglakhir_promo,
        gfh_flagigr                 as flagigr,
        gfh_flagklik                as flagklik,
        gfh_flagspi                 as flagspi,
        gfh_flagtmi                 as flagtmi,
        gfa_reguler                 as mm_reguler,
        gfa_reguler_biruplus        as mm_reguler_biruplus,
        gfa_retailer                as mm_retailer,
        gfa_silver                  as mm_silver,
        gfa_gold1                   as mm_gold1,
        gfa_gold2                   as mm_gold2,
        gfa_gold3                   as mm_gold3,
        gfa_platinum                as mm_platinum
    from tbtr_gift_hdr
    left join tbtr_gift_dtl on gfh_kodepromosi = gfd_kodepromosi
    left join tbmaster_prodmast on gfd_prdcd = prd_prdcd
    left join tbtr_gift_alokasi on gfh_kodepromosi = gfa_kodepromosi
    where
        gfh_recordid is null
        and gfh_tglawal > current_date
) master
${conditions}
order by tglawal_promo, kd_promo
    `;
};
