export const QueryPromoHjk = (conditions: string) => {
  return `
    SELECT
        hgk_prdcd,
        hgk_hrgjual,
        to_char(hgk_tglawal,'DD-MON-YY') as hgk_tglawal,
        hgk_jamawal,
        to_char(hgk_tglakhir,'DD-MON-YY') as hgk_tglakhir,
        hgk_jamakhir,
        hgk_hariaktif
    FROM tbtr_hargakhusus
    LEFT JOIN tbmaster_prodmast ON hgk_prdcd = prd_prdcd
    WHERE current_date BETWEEN date(HGK_TGLAWAL) AND date(HGK_TGLAKHIR)
    ${conditions}
  `;
};
