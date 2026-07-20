import { QueryGroupFlag } from "./queryGroupFlag";
import { QueryHargaBeli } from "./queryHargaBeli";
import { QueryPoOutStanding } from "./queryPoOutStanding";
import { QuerySalesPerDay } from "./querySalesPerDay";

type FiltersConditions = {
  conditions: string;
};
export const QueryLppSaatIni = (filters: FiltersConditions) => {
  return `
SELECT     prd.prd_kodedivisi AS st_div,
           div.div_namadivisi AS st_div_nama,
           prd.prd_kodedepartement AS st_dept,
           dep.dep_namadepartement AS st_dept_nama,
           prd.prd_kodekategoribarang AS st_katb,
           kat.kat_namakategori AS st_katb_nama,
           prd.prd_prdcd AS st_prdcd,
           prd.prd_deskripsipanjang AS st_deskripsi,
           prd.prd_unit AS st_unit,
           prd.prd_frac AS st_frac,
           COALESCE(prd.prd_kodetag, ' ') AS st_kodetag,
           CASE
             WHEN COALESCE(prd.prd_kodetag, ' ') IN ('A', 'R', 'N', 'H', 'O', 'T', 'X')
             THEN 'Discontinue'
             ELSE 'Active'
           END AS st_status_tag,
           stk.st_lokasi AS st_lokasi,
           (COALESCE(stk.st_saldoakhir, 0) - MOD(COALESCE(stk.st_saldoakhir, 0), prd.prd_frac)) / prd.prd_frac AS st_saldo_ctn,
           MOD(COALESCE(stk.st_saldoakhir, 0), prd.prd_frac) AS st_saldo_pcs,
           stk.st_saldoakhir AS st_saldo_in_pcs,
           stk.st_avgcost AS st_avgcost,
           CASE
             WHEN prd.prd_unit = 'KG' AND prd.prd_frac = 1000
             THEN stk.st_saldoakhir * stk.st_avgcost / 1000
             ELSE stk.st_saldoakhir * stk.st_avgcost
           END AS st_saldo_rph,
           stk.st_lastcost AS st_lastcost,
           CASE
             WHEN prd.prd_unit = 'KG' AND prd.prd_frac = 1000
             THEN stk.st_saldoakhir * stk.st_lastcost / 1000
             ELSE stk.st_saldoakhir * stk.st_lastcost
           END AS st_saldo_rph_lastcost,
           pkm.pkm_pkmt AS st_pkm,
           spd.spd_qty AS st_spd,
           CASE
            WHEN st_saldoakhir > 0
            AND st_sales > 0 THEN
            round((((coalesce(st_saldoawal, 1) + nullif(st_saldoakhir, 0)) / 2) / nullif(st_sales, 0)) *(EXTRACT(DAY FROM now())))
           ELSE
            0
           END AS st_dsi,
           poo.tpod_qtypo AS st_po_qty,
           sii.flag AS st_flag,
           spd.spd_qty_1 AS st_sales_bln_1,
           spd.spd_qty_2 AS st_sales_bln_2,
           spd.spd_qty_3 AS st_sales_bln_3,
           stk.st_sales AS st_sales_bln_ini,
           COALESCE(hgb.hgb_kodesupplier, 'Z9999') AS st_supp_kode,
           COALESCE(hgb.hgb_namasupplier, 'Z9999 Tidak diketahui') AS st_supp_nama,
           prd.prd_perlakuanbarang AS st_perlakuan_barang,
           hgb.hgb_hrgbeli * prd.prd_frac AS st_harga_beli,
           hgb.hgb_nilaidpp * prd.prd_frac AS st_harga_beli_netto,
           hgb.hgb_nilaidpp AS st_harga_beli_omi,
           hgb.hgb_tglmulaidisc01 AS st_disc_1_mulai,
           hgb.hgb_tglakhirdisc01 AS st_disc_1_selesai,
           hgb.hgb_persendisc01 AS st_disc_1_persen,
           hgb.hgb_rphdisc01 AS st_disc_1_rph,
           hgb.hgb_flagdisc01 AS st_disc_1_flag,
           hgb.hgb_tglmulaidisc02 AS st_disc_2_mulai,
           hgb.hgb_tglakhirdisc02 AS st_disc_2_selesai,
           hgb.hgb_persendisc02 AS st_disc_2_persen,
           hgb.hgb_rphdisc02 AS st_disc_2_rph,
           hgb.hgb_flagdisc02 AS st_disc_2_flag
    FROM tbmaster_prodmast prd
    LEFT JOIN tbmaster_stock stk ON prd.prd_prdcd = stk.st_prdcd
    LEFT JOIN tbmaster_kkpkm pkm ON prd.prd_prdcd = pkm.pkm_prdcd
    LEFT JOIN tbmaster_divisi div ON prd.prd_kodedivisi = div.div_kodedivisi
    LEFT JOIN tbmaster_departement dep ON prd.prd_kodedepartement = dep.dep_kodedepartement
    LEFT JOIN (${QueryHargaBeli()}) hgb ON prd.prd_prdcd = hgb.hgb_prdcd
    LEFT JOIN (SELECT kat_kodedepartement || kat_kodekategori AS kat_kodekategori, kat_namakategori FROM tbmaster_kategori) kat ON prd.prd_kodedepartement || prd.prd_kodekategoribarang = kat.kat_kodekategori
    LEFT JOIN (${QuerySalesPerDay()}) spd ON prd.prd_prdcd = spd.spd_prdcd
    LEFT JOIN (${QueryPoOutStanding()}) poo ON prd.prd_prdcd = poo.tpod_prdcd
    LEFT JOIN (${QueryGroupFlag()}) sii ON prd.prd_prdcd = sii.plu
    WHERE prd.prd_prdcd LIKE '%0'
   ${filters.conditions ? `AND ${filters.conditions}` : ""}
    `;
};
