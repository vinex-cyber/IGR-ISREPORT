// src/utils/query/queryCashbackMaster.ts

export const QueryCashbackMaster = (
  flag: string,
  alokasiCondition: string,
  suffix: string,
) => {
  // Runtime validation — TypeScript interface hanya compile-time, tidak prevent SQL injection
  // flag: whitelist huruf & underscore saja (MERAH, BIRU, PLATINUM)
  if (!/^[A-Z_]+$/i.test(flag)) {
    throw new Error(`Invalid flag: ${flag}`);
  }
  // suffix: whitelist huruf, angka, underscore (mm, biru, _1)
  if (!/^[a-z_0-9]*$/i.test(suffix)) {
    throw new Error(`Invalid suffix: ${suffix}`);
  }
  // alokasiCondition: deny SQL statement termination & comment injection
  // Single quote diperbolehkan karena dibutuhkan untuk SQL string literal ('0', '1')
  if (/--|\/\*|DROP|DELETE|INSERT|UPDATE|EXEC/i.test(alokasiCondition)) {
    throw new Error(
      "Invalid alokasiCondition: contains dangerous SQL patterns",
    );
  }

  return `
  WITH
    promo_md AS (
      SELECT DISTINCT
        prmd_prdcd AS plup,
        prmd_hrgjual AS hrgp,
        prmd_flag_pos AS flag_pos,
        prmd_flag_klik AS flag_klik,
        prmd_flag_spi AS flag_spi,
        CASE
          WHEN alk_member = 'PLATINUM' THEN 'PLATINUM'
          WHEN alk_member IN ('REGBIRUPLUS', 'REGBIRU') THEN 'BIRU'
          ELSE 'MERAH'
        END AS flag
      FROM tbtr_promomd
      LEFT JOIN tbtr_promomd_alokasi ON SUBSTR(prmd_prdcd, 1, 6) || 0 = alk_prdcd
      WHERE date_trunc('day', prmd_tglawal) <= CURRENT_DATE
        AND date_trunc('day', prmd_tglakhir) >= CURRENT_DATE
        AND prmd_prdcd ILIKE $1
    ),
    promo_filtered AS (
      SELECT plup, hrgp, flag_pos, flag_klik, flag_spi FROM promo_md WHERE flag = '${flag}'
    ),
    product_master AS (
      SELECT
        prd_prdcd AS plun, prd_deskripsipanjang AS desk,
        prd_frac AS fracn, prd_unit AS unit,
        prd_minjual AS minjualn, prd_hrgjual AS hrgn
      FROM tbmaster_prodmast
      WHERE prd_prdcd ILIKE $1
    ),
    product_with_promo AS (
      SELECT DISTINCT
        pm.plun, pm.desk, pm.fracn, pm.unit,
        pm.minjualn, pm.hrgn, pf.hrgp,
        pf.flag_pos, pf.flag_klik, pf.flag_spi
      FROM product_master pm
      LEFT JOIN promo_filtered pf ON pm.plun = pf.plup
    ),
    cashback_hdr AS (
      SELECT
        cbd_prdcd AS pluc,
        CASE
          WHEN cbh_minrphprodukpromo < cbh_mintotbelanja THEN cbh_mintotbelanja
          WHEN cbh_minrphprodukpromo > 0 THEN cbh_minrphprodukpromo
          ELSE cbh_mintotbelanja
        END AS minrphc,
        cbd_minstruk AS minjualc,
        CASE WHEN cbd_maxstruk > '-1' THEN 999999999 ELSE cbd_maxstruk END AS maxjualc,
        CASE WHEN cbh_maxstrkperhari > '-1' THEN 999999999 ELSE cbh_maxstrkperhari END AS maxrphc,
        cbh_cashback AS cbh,
        cbd_cashback AS cbd
      FROM tbtr_cashback_hdr
      LEFT JOIN tbtr_cashback_dtl ON cbh_kodepromosi = cbd_kodepromosi
      LEFT JOIN tbtr_cashback_alokasi cba ON cbh_kodepromosi = cba_kodepromosi
      WHERE cbh_tglakhir::DATE >= CURRENT_DATE
        AND cbh_tglawal::DATE <= CURRENT_DATE
        AND ${alokasiCondition}
        AND cbh_namapromosi NOT LIKE '%UNIQUE%'
        AND cbh_namapromosi NOT LIKE '%PWP%'
        AND cbh_namapromosi NOT LIKE '%UNICODE%'
        AND cbh_namapromosi NOT LIKE 'KLIK%'
        AND cbh_namapromosi NOT LIKE '%PAKET%'
        AND cbh_namapromosi NOT LIKE '%20%PERISHABLE%'
        AND cbh_namapromosi NOT LIKE '%50%PERISHABLE%'
        AND cbh_kodepromosi <> 'CZK19'
        AND COALESCE(cbh_kiosk, 'N') IN ('N', 'O')
        AND COALESCE(cbd_recordid, '2') <> '1'
        AND COALESCE(cbd_redeempoint, '0') = '0'
    ),
    cashback_filtered AS (
      SELECT * FROM cashback_hdr WHERE pluc ILIKE $1
    ),
    joined AS (
      SELECT
        pwp.plun, pwp.desk, pwp.fracn, pwp.unit,
        pwp.minjualn, pwp.hrgn, pwp.hrgp,
        pwp.flag_pos, pwp.flag_klik, pwp.flag_spi,
        CASE
          WHEN pwp.unit LIKE 'RCG' OR pwp.unit = 'HGR' THEN 1 * pwp.minjualn
          ELSE pwp.fracn * pwp.minjualn
        END AS qty,
        CASE 
          WHEN COALESCE(pwp.hrgp, 0) = 0
            OR (COALESCE(NULLIF(pwp.flag_pos,''), 'N') = 'N' 
            AND COALESCE(NULLIF(pwp.flag_klik,''), 'N') = 'N' 
            AND COALESCE(NULLIF(pwp.flag_spi,''), 'N') = 'N')
          THEN pwp.hrgn 
          ELSE pwp.hrgp 
        END AS hrg,
        cf.minrphc, cf.minjualc, cf.maxjualc, cf.maxrphc, cf.cbh, cf.cbd
      FROM product_with_promo pwp
      LEFT JOIN cashback_filtered cf ON SUBSTR(pwp.plun, 1, 6) || 0 = cf.pluc
    ),
    calc_jml AS (
      SELECT
        plun, minrphc, minjualc, maxjualc, maxrphc,
        cbd, cbh, hrgn, hrgp, hrg, qty,
        CASE
          WHEN plun LIKE '%0' OR plun LIKE '%3' THEN
            CASE WHEN COALESCE(minrphc,0) <> '0' THEN
              CASE WHEN hrg > maxrphc THEN floor(maxrphc / minrphc)
                   ELSE floor(hrg / minrphc) END
            ELSE 0 END
          ELSE
            CASE WHEN COALESCE(minrphc,0) <> '0' THEN
              CASE WHEN (hrg * qty) > maxrphc THEN floor(maxrphc / minrphc)
                   ELSE floor((hrg * qty) / minrphc) END
            ELSE 0 END
        END AS jmlcbh,
        CASE WHEN COALESCE(minjualc,0) <> '0' THEN
          CASE WHEN unit = 'RCG' OR unit = 'HGR' THEN floor((qty * fracn) / minjualc)
               ELSE CASE WHEN qty > maxjualc THEN floor(maxjualc / minjualc)
                         ELSE floor(qty / minjualc) END
          END
        ELSE 0 END AS jmlcbd
      FROM joined
    ),
    group_tier AS (
      SELECT
        plun, minrphc, minjualc, maxjualc, maxrphc,
        cbd, cbh, hrgn, hrgp, hrg, qty,
        SUM(jmlcbh) AS jmlcbh,
        SUM(jmlcbd) AS jmlcbd
      FROM calc_jml
      GROUP BY plun, minrphc, minjualc, maxjualc, maxrphc, cbd, cbh, hrgn, hrgp, hrg, qty
    ),
    group_product AS (
      SELECT
        plun, hrgn, hrgp, hrg, qty,
        SUM((jmlcbh * cbh) + (jmlcbd * cbd)) AS cb
      FROM group_tier
      GROUP BY plun, hrgn, hrgp, hrg, qty
    ),
    with_unit AS (
      SELECT gp.*, pm.prd_unit
      FROM group_product gp
      LEFT JOIN tbmaster_prodmast pm ON pm.prd_prdcd = gp.plun
    ),
    final AS (
      SELECT
        plun AS plu${suffix},
        CASE
          WHEN plun LIKE '%0' OR plun LIKE '%3' OR prd_unit = 'KG' THEN hrg
          ELSE hrg * qty
        END AS hrg${suffix},
        cb AS cb${suffix},
        ROUND(CASE
          WHEN plun LIKE '%0' OR plun LIKE '%3' OR prd_unit = 'KG' THEN hrg
          ELSE hrg * qty
        END) - COALESCE(cb, 0) AS hrg_net${suffix}
      FROM with_unit
    )
  SELECT * FROM final
  `;
};
