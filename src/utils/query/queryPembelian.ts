// src/utils/query/queryPembelian.ts

export const QueryPembelian = `
SELECT
  pbh_tglpb,
  pbd_nopb,
  pbd_prdcd,
  pbd_qtypb,
  ((pbd_qtypb / prd_frac) * (pbd_hrgsatuan / prd_frac) + pbd_ppn) AS pbd_rp,
  pbd_pkmt,
  pbd_saldoakhir,
  pbh_keteranganpb,
  pbd_nopo,
  tpod_tglpo,
  tpod_qtypo,
  mstd_nodoc,
  mstd_tgldoc,
  mstd_qty,
  ((mstd_qty / prd_frac) * (mstd_hrgsatuan / prd_frac) + mstd_ppnrph - mstd_discrph) AS mstd_rp,
  sup_jangkawaktukirimbarang,
  hgb_kodesupplier,
  sup_namasupplier,
  CASE
    WHEN NOW() BETWEEN tpod_tglpo AND (tpod_tglpo + INTERVAL '1 day' * sup_jangkawaktukirimbarang)
      AND tpod_recordid IS NULL
      AND pbd_nopb IS NOT NULL
      THEN 'Brg blm dikirim'
    WHEN tpod_recordid IS NULL
      AND pbd_nopb IS NOT NULL
      AND mstd_qty IS NULL
      THEN 'POmati/Kdlwarsa'
    WHEN tpod_recordid = '1'
      THEN 'PO Alokasi/Mati'
    WHEN tpod_recordid IN ('1','2')
      AND (tpod_qtypb = '0' OR tpod_qtypb IS NULL)
      THEN 'QTY BPB 0'
    WHEN pbd_nopb IS NULL
      AND (tpod_qtypb = '0' OR tpod_qtypb IS NULL)
      THEN 'PO Alokasi/Mati'
    WHEN pbd_nopb IS NULL
      AND (tpod_qtypb <> '0' OR tpod_qtypb IS NOT NULL)
      AND mstd_nopo IS NULL
      THEN 'PO Alokasi'
    WHEN mstd_recordid IS NULL
      AND tpod_recordid = '2'
      AND mstd_qty IS NOT NULL
      THEN 'Sudah BTB'
  END AS ket
FROM tbtr_pb_d
LEFT JOIN tbmaster_prodmast ON pbd_prdcd = prd_prdcd
LEFT JOIN tbtr_pb_h ON pbd_nopb = pbh_nopb
LEFT JOIN tbtr_po_d ON pbd_nopo = tpod_nopo AND pbd_prdcd = tpod_prdcd
LEFT JOIN tbtr_mstran_d ON pbd_nopo = mstd_nopo AND pbd_prdcd = mstd_prdcd
LEFT JOIN (
  SELECT
    hgb_prdcd,
    hgb_kodesupplier,
    sup_namasupplier,
    sup_jangkawaktukirimbarang
  FROM (
    SELECT hgb_prdcd, hgb_kodesupplier
    FROM tbmaster_hargabeli
    WHERE hgb_tipe = '2'
  ) AS hgb
  LEFT JOIN (
    SELECT sup_kodesupplier, sup_namasupplier, sup_jangkawaktukirimbarang
    FROM tbmaster_supplier
  ) AS sup ON hgb.hgb_kodesupplier = sup.sup_kodesupplier
) AS supplier ON pbd_prdcd = supplier.hgb_prdcd AND pbd_kodesupplier = supplier.hgb_kodesupplier
`;
