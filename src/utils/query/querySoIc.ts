// src/utils/query/querySoIc.ts
import { QueryGroupFlag } from "./queryGroupFlag";

export const QuerySoIc = `
  SELECT
    rso_tglso,
    info_produk.prd_kodedivisi,
    info_produk.prd_kodedepartement,
    info_produk.prd_kodekategoribarang,
    soic.rso_prdcd,
    info_produk.prd_unit,
    info_produk.prd_frac,
    gf.flag,
    toko,
    gudang,
    rso_qtylpp,
    rso_qtyreset,
    rph,
    hgb_kodesupplier,
    sup_namasupplier
  FROM (
    SELECT
      rso_tglso,
      rso_prdcd,
      toko,
      gudang,
      rso_qtylpp,
      rso_qtyreset,
      rph
    FROM (
      SELECT
        rso_tglso,
        rso_prdcd,
        rso_qtylpp,
        rso_qtyreset,
        (rso_qtyreset * rso_avgcostreset) AS rph
      FROM tbtr_reset_soic
    ) AS rso
    LEFT JOIN (
      SELECT
        lso_tglso,
        lso_prdcd,
        SUM(CASE WHEN SUBSTR(lso_koderak, 1, 1) IN ('R', 'O', 'F', 'X', 'K') THEN lso_qty ELSE 0 END) AS toko,
        SUM(CASE WHEN SUBSTR(lso_koderak, 1, 1) NOT IN ('R', 'O', 'F', 'X', 'K') THEN lso_qty ELSE 0 END) AS gudang
      FROM tbtr_lokasi_soic
      WHERE lso_flagtahap = '05'
      GROUP BY lso_tglso, lso_prdcd
    ) AS lso ON rso.rso_tglso = lso.lso_tglso AND rso.rso_prdcd = lso.lso_prdcd
  ) AS soic
  LEFT JOIN (
    SELECT DISTINCT
      prd_prdcd,
      prd_kodedivisi,
      prd_kodedepartement,
      prd_kodekategoribarang,
      prd_deskripsipanjang,
      prd_unit,
      prd_frac,
      CASE
        WHEN pluomi IS NULL THEN 'igr only'
        ELSE 'igr + omi'
      END AS flag
    FROM (
      SELECT
        prd_prdcd, prd_kodedivisi, prd_kodedepartement,
        prd_kodekategoribarang, prd_deskripsipanjang, prd_unit, prd_frac
      FROM tbmaster_prodmast
      WHERE prd_prdcd LIKE '%0'
    ) AS prd
    LEFT JOIN (
      SELECT
        prc_pluigr,
        COALESCE(fpl_freepluomi, prc_pluomi) AS pluomi,
        prc_kodetag
      FROM (
        SELECT DISTINCT
          CONCAT(SUBSTR(prc_pluigr, 0, 6), '0') AS prc_pluigr,
          prc_pluomi, prc_kodetag
        FROM tbmaster_prodcrm
      ) AS prc
      LEFT JOIN (
        SELECT
          CONCAT(SUBSTR(fpl_pluigr, 0, 6), '0') AS fpl_pluigr,
          fpl_freepluomi
        FROM tbmaster_freeplu
        WHERE fpl_recordid IS NULL
      ) AS fpl ON prc.prc_pluigr = fpl.fpl_pluigr
    ) AS itemomi ON prd.prd_prdcd = itemomi.prc_pluigr
  ) AS info_produk ON soic.rso_prdcd = info_produk.prd_prdcd
  LEFT JOIN (${QueryGroupFlag()}) AS gf ON soic.rso_prdcd = gf.plu
  LEFT JOIN (
    SELECT
      hgb_prdcd, hgb_kodesupplier, sup_namasupplier
    FROM (
      SELECT hgb_prdcd, hgb_kodesupplier
      FROM tbmaster_hargabeli
      WHERE hgb_tipe = '2'
    ) AS hgb
    LEFT JOIN (
      SELECT sup_kodesupplier, sup_namasupplier
      FROM tbmaster_supplier
    ) AS sup ON hgb.hgb_kodesupplier = sup.sup_kodesupplier
  ) AS supplier ON soic.rso_prdcd = supplier.hgb_prdcd
`;
