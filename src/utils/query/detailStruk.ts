import type { QueryParam } from "@/types/queryParams";

export const DetailStruk = (
  conditions: string,
  params: QueryParam[],
): string => {
  const startDate = params[0] || null;
  const endDate = params[1] || null;

  const buildDateFilter = (alias: string): string => {
    if (startDate && endDate) {
      return `${alias} >= '${startDate}' AND ${alias} <= '${endDate}'`;
    } else if (startDate) {
      return `date_trunc('day', ${alias}) >= '${startDate}'`;
    } else if (endDate) {
      return `date_trunc('day', ${alias}) = '${endDate}'`;
    }
    return "";
  };

  const jualdetailDateFilter = buildDateFilter("trjd_transactiondate");
  const virtualDateFilter = buildDateFilter("vir_transactiondate");

  const jualdetailWhere = jualdetailDateFilter
    ? `WHERE ${jualdetailDateFilter}`
    : `WHERE date_trunc('day', trjd_transactiondate) = current_date`;

  const virtualWhere = virtualDateFilter
    ? `AND ${virtualDateFilter}`
    : `AND date_trunc('day', vir_transactiondate) = current_date`;

  return `
SELECT
  dtl_rtype,
  dtl_tanggal,
  dtl_jam,
  dtl_struk,
  dtl_stat,
  dtl_kasir,
  dtl_no_struk,
  dtl_seqno,
  dtl_prdcd_ctn,
  dtl_prdcd,
  dtl_nama_barang,
  dtl_unit,
  dtl_frac,
  dtl_tag,
  dtl_bkp,
  dtl_qty_pcs,
  dtl_qty,
  dtl_harga_jual,
  dtl_diskon,
  CASE WHEN dtl_rtype='S' THEN dtl_gross ELSE dtl_gross * -1 END AS dtl_gross,
  CASE WHEN dtl_rtype='R' THEN (dtl_netto * -1) ELSE dtl_netto END AS dtl_netto,
  CASE WHEN dtl_rtype='R' THEN (dtl_hpp * -1) ELSE dtl_hpp END AS dtl_hpp,
  CASE WHEN dtl_rtype='S' THEN dtl_netto - dtl_hpp ELSE (dtl_netto - dtl_hpp) * -1 END AS dtl_margin,
  dtl_k_div,
  dtl_nama_div,
  dtl_k_dept,
  dtl_nama_dept,
  dtl_k_katb,
  dtl_nama_katb,
  dtl_cusno,
  dtl_namamember,
  dtl_memberkhusus,
  dtl_outlet,
  dtl_suboutlet,
  dtl_kategori,
  dtl_sub_kategori,
  dtl_tipemember,
  dtl_group_member,
  hgb_kodesupplier AS dtl_kodesupplier,
  sup_namasupplier AS dtl_namasupplier,
  dtl_tglmulai,
  dtl_tglakhir,
  COALESCE(dtl_method, 'CASH') AS dtl_method,
  vir_amount AS dtl_amount,
  vir_type AS dtl_virtype,
  key_vir
FROM (
  SELECT
    date_trunc('day', trjd_transactiondate) AS dtl_tanggal,
    to_char(trjd_transactiondate, 'hh24:mi:ss') AS dtl_jam,
    to_char(trjd_transactiondate, 'yyyymmdd') || trjd_create_by || trjd_transactionno || trjd_transactiontype AS dtl_struk,
    trjd_cashierstation AS dtl_stat,
    trjd_create_by AS dtl_kasir,
    trjd_transactionno AS dtl_no_struk,
    substr(trjd_prdcd, 1, 6) || '0' AS dtl_prdcd_ctn,
    trjd_prdcd AS dtl_prdcd,
    prd_deskripsipanjang AS dtl_nama_barang,
    prd_unit AS dtl_unit,
    prd_frac AS dtl_frac,
    COALESCE(prd_kodetag, ' ') AS dtl_tag,
    trjd_flagtax1 AS dtl_bkp,
    trjd_transactiontype AS dtl_rtype,
    trim(trjd_divisioncode) AS dtl_k_div,
    div_namadivisi AS dtl_nama_div,
    substr(trjd_division, 1, 2) AS dtl_k_dept,
    dep_namadepartement AS dtl_nama_dept,
    substr(trjd_division, 3, 2) AS dtl_k_katb,
    kat_namakategori AS dtl_nama_katb,
    trjd_cus_kodemember AS dtl_cusno,
    cus_namamember AS dtl_namamember,
    cus_flagmemberkhusus AS dtl_memberkhusus,
    cus_kodeoutlet AS dtl_outlet,
    upper(cus_kodesuboutlet) AS dtl_suboutlet,
    crm_kategori AS dtl_kategori,
    crm_subkategori AS dtl_sub_kategori,
    trjd_quantity AS dtl_qty,
    trjd_unitprice AS dtl_harga_jual,
    trjd_discount AS dtl_diskon,
    trjd_seqno AS dtl_seqno,
    CASE
      WHEN cus_jenismember = 'T' THEN 'TMI'
      WHEN cus_flagmemberkhusus = 'Y' THEN 'KHUSUS'
      WHEN trjd_create_by IN ('IDM', 'ID1', 'ID2') THEN 'IDM'
      WHEN trjd_create_by IN ('OMI', 'BKL') THEN 'OMI'
      ELSE 'REGULER'
    END AS dtl_tipemember,
    CASE
      WHEN cus_flagmemberkhusus = 'Y' THEN 'GROUP_1_KHUSUS'
      WHEN trjd_create_by = 'IDM' THEN 'GROUP_2_IDM'
      WHEN trjd_create_by IN ('OMI', 'BKL') THEN 'GROUP_3_OMI'
      WHEN cus_flagmemberkhusus IS NULL AND cus_kodeoutlet = '6' THEN 'GROUP_4_END_USER'
      ELSE 'GROUP_5_OTHERS'
    END AS dtl_group_member,
    CASE
      WHEN prd_unit = 'KG' AND prd_frac = 1000 THEN trjd_quantity
      ELSE trjd_quantity * prd_frac
    END AS dtl_qty_pcs,
    CASE
      WHEN trjd_flagtax2 = 'Y' AND trjd_create_by IN ('IDM', 'OMI', 'BKL')
      THEN trjd_nominalamt * 1.11
      ELSE trjd_nominalamt
    END AS dtl_gross,
    CASE
      WHEN trjd_flagtax2 = 'Y' AND trjd_create_by NOT IN ('IDM', 'OMI', 'BKL')
      THEN trjd_nominalamt / 1.11
      ELSE trjd_nominalamt
    END AS dtl_netto,
    CASE
      WHEN prd_unit = 'KG' THEN (trjd_quantity * trjd_baseprice) / 1000
      ELSE trjd_quantity * trjd_baseprice
    END AS dtl_hpp
  FROM (
    SELECT DISTINCT
      trjd_kodeigr, trjd_recordid, trjd_transactionno, trjd_seqno,
      trjd_prdcd, trjd_flaggoodsnodisc, trjd_flagtax1, trjd_flagtax2,
      trjd_quantity, trjd_unitprice, trjd_discount, trjd_nominalamt,
      trjd_divisioncode, trjd_division, trjd_baseprice, trjd_cus_kodemember,
      trjd_prd_deskripsipendek, trjd_create_by, trjd_create_dt,
      trjd_modify_by, trjd_modify_dt, trjd_admfee, trjd_cashierstation,
      trjd_transactiondate, trjd_transactiontype,
      trjd_noinvoice1::text AS trjd_noinvoice1,
      trjd_noinvoice2::text AS trjd_noinvoice2, p_qty
    FROM (
      SELECT
        trjd_kodeigr, trjd_recordid, trjd_transactionno, trjd_seqno,
        trjd_prdcd, trjd_flaggoodsnodisc, trjd_flagtax1, trjd_flagtax2,
        trjd_quantity, trjd_unitprice, trjd_discount, trjd_nominalamt,
        trjd_divisioncode, trjd_division, trjd_baseprice, trjd_cus_kodemember,
        trjd_prd_deskripsipendek, trjd_create_by, trjd_create_dt,
        trjd_modify_by, trjd_modify_dt, trjd_admfee, trjd_cashierstation,
        trjd_transactiondate, trjd_transactiontype,
        trjd_noinvoice1::text AS trjd_noinvoice1,
        trjd_noinvoice2::text AS trjd_noinvoice2, p_qty
      FROM tbtr_jualdetail
      ${
        jualdetailDateFilter
          ? `WHERE ${jualdetailDateFilter} AND trjd_recordid IS NULL AND trjd_quantity <> 0`
          : `WHERE date_trunc('day', trjd_create_dt) = date_trunc('day', now()) AND trjd_recordid IS NULL AND trjd_quantity <> 0`
      }
      UNION ALL
      SELECT
        trjd_kodeigr, trjd_recordid, trjd_transactionno, trjd_seqno,
        trjd_prdcd, trjd_flaggoodsnodisc, trjd_flagtax1, trjd_flagtax2,
        trjd_quantity, trjd_unitprice, trjd_discount, trjd_nominalamt,
        trjd_divisioncode, trjd_division, trjd_baseprice, trjd_cus_kodemember,
        trjd_prd_deskripsipendek, trjd_create_by, trjd_create_dt,
        trjd_modify_by, trjd_modify_dt, trjd_admfee, trjd_cashierstation,
        trjd_transactiondate, trjd_transactiontype,
        trjd_noinvoice1::text AS trjd_noinvoice1,
        trjd_noinvoice2::text AS trjd_noinvoice2, p_qty
      FROM tbtr_jualdetail_interface
      ${
        jualdetailDateFilter
          ? `WHERE ${jualdetailDateFilter} AND trjd_recordid IS NULL AND trjd_quantity <> 0`
          : `WHERE date_trunc('day', trjd_create_dt) = date_trunc('day', now()) AND trjd_recordid IS NULL AND trjd_quantity <> 0`
      }
    ) s
  ) trjd
  LEFT JOIN tbmaster_prodmast ON trjd_prdcd = prd_prdcd
  LEFT JOIN tbmaster_tokoigr ON trjd_cus_kodemember = tko_kodecustomer
  LEFT JOIN tbmaster_customer ON trjd_cus_kodemember = cus_kodemember
  LEFT JOIN tbmaster_customercrm ON trjd_cus_kodemember = crm_kodemember
  LEFT JOIN tbmaster_divisi ON trjd_divisioncode = div_kodedivisi
  LEFT JOIN tbmaster_departement ON substr(trjd_division, 1, 2) = dep_kodedepartement
  LEFT JOIN tbmaster_kategori ON trjd_division = kat_kodedepartement || kat_kodekategori
) sls

LEFT JOIN (
  SELECT
    m.hgb_prdcd,
    m.hgb_kodesupplier,
    s.sup_namasupplier
  FROM tbmaster_hargabeli m
  LEFT JOIN tbmaster_supplier s ON m.hgb_kodesupplier = s.sup_kodesupplier
  WHERE m.hgb_tipe = '2'
  AND m.hgb_recordid IS NULL
) gb ON dtl_prdcd_ctn = hgb_prdcd

LEFT JOIN (
  -- filter tanggal agar tidak scan seluruh tabel
  SELECT DISTINCT
    trjd_cus_kodemember AS kdmem,
    COALESCE(MIN(DATE(cus_tglmulai)), MIN(DATE(trjd_transactiondate))) AS dtl_tglmulai,
    MAX(DATE(trjd_transactiondate)) AS dtl_tglakhir
  FROM (
    SELECT trjd_cus_kodemember, trjd_transactiondate
    FROM tbtr_jualdetail
    ${jualdetailWhere}
    UNION ALL
    SELECT trjd_cus_kodemember, trjd_transactiondate
    FROM tbtr_jualdetail_interface
    ${jualdetailWhere}
  ) tra
  LEFT JOIN tbmaster_customer ON trjd_cus_kodemember = cus_kodemember
  GROUP BY trjd_cus_kodemember
) akr ON kdmem = dtl_cusno

LEFT JOIN (
  SELECT DISTINCT
    to_char(vir_transactiondate, 'yyyymmdd') || vir_create_by || vir_transactionno || vir_transactiontype AS key_vir,
    string_agg(vir_type || ' - ' || vir_amount, ' + ') AS vir_type,
    COALESCE(vir_method, 'CASH') AS dtl_method,
    COALESCE(SUM(vir_amount), 0) AS vir_amount
  FROM tbtr_virtual
  WHERE vir_transactiontype = 'S'
  ${virtualWhere}
  GROUP BY
    vir_transactiondate, vir_create_by, vir_transactionno, vir_transactiontype,
    to_char(vir_transactiondate, 'yyyymmdd') || vir_create_by || vir_cashierstation || vir_transactionno || vir_transactiontype,
    vir_method
) AS vir ON key_vir = dtl_struk

${conditions ? conditions : `WHERE date_trunc('day', dtl_tanggal) = current_date`}
`;
};
