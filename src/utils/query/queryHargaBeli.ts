export const QueryHargaBeli = () => {
  return `
SELECT
    hgb.hgb_prdcd,
	hgb.hgb_hrgbeli,
	hgb.hgb_statusbarang,
	hgb.hgb_tglmulaidisc01,
	hgb.hgb_tglakhirdisc01,
	hgb.hgb_persendisc01,
	hgb.hgb_rphdisc01,
	hgb.hgb_flagdisc01,
	hgb.hgb_tglmulaidisc02,
	hgb.hgb_tglakhirdisc02,
	hgb.hgb_persendisc02,
	hgb.hgb_rphdisc02,
	hgb.hgb_flagdisc02,
	hgb.hgb_nilaidpp,
	hgb.hgb_top,
	hgb.hgb_kodesupplier,
	sup.sup_namasupplier AS hgb_namasupplier,
	sup.sup_jangkawaktukirimbarang AS hgb_lead_time,
	sup.sup_minrph as hgb_minrph  
FROM tbmaster_hargabeli hgb
LEFT JOIN tbmaster_supplier sup
hgb.hgb_kodesupplier = sup.sup_kodesupplier
WHERE hgb.hgb_tipe      = '2' 
    `;
};
