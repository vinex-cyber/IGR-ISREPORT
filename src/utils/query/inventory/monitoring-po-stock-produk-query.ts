export const MonitoringPoStockProdukQuery = (): string => {
  return `
        
SELECT
    p.prd_kodedivisi AS div,
    p.prd_kodedepartement AS dept,
    p.prd_kodekategoribarang AS kat,
    p.prd_prdcd AS plu,
    p.prd_deskripsipanjang AS nama_barang,
    p.prd_frac AS frac,
    p.prd_unit AS unit,
    p.prd_kodetag AS tag,

    st.st_saldoakhir AS stock,

    CASE
        WHEN st.st_saldoakhir > 0 AND st.st_sales > 0 THEN
            ROUND(
                (
                    (COALESCE(st.st_saldoawal, 1)
                     + st.st_saldoakhir) / 2.0
                    / st.st_sales
                ) * EXTRACT(DAY FROM CURRENT_DATE)
            )
        ELSE 0
    END AS dsi,

    st.st_lastcost AS lcost,
    st.st_avgcost AS acost,
    h.hgb_hrgbeli AS hgbeli,
    po.qtyostpo AS po_out,
    po.nopo,
    po.ket,
    st.st_sales AS sales_jalan,

    jual.bulan_1,
    jual.bulan_2,
    jual.bulan_3,

    (jual.bulan_1 + jual.bulan_2 + jual.bulan_3)
        / 3.0 AS avgsls_qty,

    k.pkm_pkmt AS pkm,
    k.pkm_minorder AS minorder,
    h.hgb_kodesupplier AS kd_supl,
    s.sup_namasupplier AS nama_supplier

FROM tbmaster_prodmast p

JOIN tbmaster_hargabeli h
    ON h.hgb_prdcd = p.prd_prdcd
   AND h.hgb_tipe = '2'

LEFT JOIN tbmaster_supplier s
    ON s.sup_kodesupplier = h.hgb_kodesupplier

LEFT JOIN tbmaster_stock st
    ON st.st_prdcd = p.prd_prdcd
   AND st.st_lokasi = '01'

LEFT JOIN (
    SELECT
        po_line.base,
        SUM(po_line.tpod_qtypo) AS qtyostpo,
        trim(po_line.tpod_nopo) AS nopo,
        string_agg(DISTINCT po_line.ket, ', '
            ORDER BY po_line.ket) AS ket
    FROM (
        SELECT
            substr(d.tpod_prdcd, 1, 6) AS base,
            d.tpod_prdcd,
            d.tpod_qtypo,
            d.tpod_nopo,
            d.tpod_tglpo,
            d.tpod_recordid,
            d.tpod_qtypb,
            pb.pbd_nopb,
            m.mstd_qty,
            m.mstd_nopo,
            m.mstd_recordid,
            sup.sup_jangkawaktukirimbarang,
            CASE
                WHEN NOW() BETWEEN d.tpod_tglpo AND (d.tpod_tglpo + INTERVAL '1 day' * sup.sup_jangkawaktukirimbarang)
                AND d.tpod_recordid IS NULL
                AND pb.pbd_nopb IS NOT NULL
                THEN 'Brg blm dikirim'
                WHEN d.tpod_recordid IS NULL
                AND pb.pbd_nopb IS NOT NULL
                AND m.mstd_qty IS NULL
                THEN 'PO mati / Kdlwarsa'
                WHEN d.tpod_recordid = '1'
                THEN 'PO Alokasi / Mati'
                WHEN d.tpod_recordid IN ('1','2')
                AND (d.tpod_qtypb = '0' OR d.tpod_qtypb IS NULL)
                THEN 'QTY BPB 0'
                WHEN pb.pbd_nopb IS NULL
                AND (d.tpod_qtypb = '0' OR d.tpod_qtypb IS NULL)
                THEN 'PO Alokasi / Mati'
                WHEN pb.pbd_nopb IS NULL
                AND (d.tpod_qtypb <> '0' OR d.tpod_qtypb IS NOT NULL)
                AND m.mstd_nopo IS NULL
                THEN 'PO Alokasi'
                WHEN m.mstd_recordid IS NULL
                AND d.tpod_recordid = '2'
                AND m.mstd_qty IS NOT NULL
                THEN 'Sudah BTB'
            END AS ket
        FROM tbtr_po_h h
        JOIN tbtr_po_d d
            ON d.tpod_nopo = h.tpoh_nopo
        LEFT JOIN tbtr_pb_d pb
            ON pb.pbd_nopo = d.tpod_nopo
           AND pb.pbd_prdcd = d.tpod_prdcd
        LEFT JOIN tbtr_mstran_d m
            ON m.mstd_nopo = d.tpod_nopo
           AND m.mstd_prdcd = d.tpod_prdcd
        LEFT JOIN (
            SELECT
                hgb.hgb_prdcd,
                MIN(sup.sup_jangkawaktukirimbarang) AS sup_jangkawaktukirimbarang
            FROM tbmaster_hargabeli hgb
            LEFT JOIN tbmaster_supplier sup
                ON sup.sup_kodesupplier = hgb.hgb_kodesupplier
            WHERE hgb.hgb_tipe = '2'
            GROUP BY hgb.hgb_prdcd
        ) sup
            ON sup.hgb_prdcd = d.tpod_prdcd
        WHERE
            h.tpoh_tglpo
                + (h.tpoh_jwpb * INTERVAL '1 day')
                >= CURRENT_DATE
            AND h.tpoh_recordid IS NULL
    ) po_line
    GROUP BY
        po_line.base,
        trim(po_line.tpod_nopo)
) po
    ON po.base = substr(p.prd_prdcd, 1, 6)

LEFT JOIN tbtr_salesbulanan sl
    ON sl.sls_prdcd = p.prd_prdcd

LEFT JOIN tbmaster_kkpkm k
    ON k.pkm_prdcd = p.prd_prdcd

CROSS JOIN LATERAL (
    SELECT
        ((EXTRACT(MONTH FROM CURRENT_DATE)::int - 2 + 12) % 12) + 1
            AS m1,
        ((EXTRACT(MONTH FROM CURRENT_DATE)::int - 3 + 12) % 12) + 1
            AS m2,
        ((EXTRACT(MONTH FROM CURRENT_DATE)::int - 4 + 12) % 12) + 1
            AS m3
) bulan

CROSS JOIN LATERAL (
    SELECT
        COALESCE(
            (ARRAY[
                sl.sls_qty_01, sl.sls_qty_02, sl.sls_qty_03,
                sl.sls_qty_04, sl.sls_qty_05, sl.sls_qty_06,
                sl.sls_qty_07, sl.sls_qty_08, sl.sls_qty_09,
                sl.sls_qty_10, sl.sls_qty_11, sl.sls_qty_12
            ])[bulan.m1], 0
        ) AS bulan_1,

        COALESCE(
            (ARRAY[
                sl.sls_qty_01, sl.sls_qty_02, sl.sls_qty_03,
                sl.sls_qty_04, sl.sls_qty_05, sl.sls_qty_06,
                sl.sls_qty_07, sl.sls_qty_08, sl.sls_qty_09,
                sl.sls_qty_10, sl.sls_qty_11, sl.sls_qty_12
            ])[bulan.m2], 0
        ) AS bulan_2,

        COALESCE(
            (ARRAY[
                sl.sls_qty_01, sl.sls_qty_02, sl.sls_qty_03,
                sl.sls_qty_04, sl.sls_qty_05, sl.sls_qty_06,
                sl.sls_qty_07, sl.sls_qty_08, sl.sls_qty_09,
                sl.sls_qty_10, sl.sls_qty_11, sl.sls_qty_12
            ])[bulan.m3], 0
        ) AS bulan_3
) jual

WHERE
    p.prd_prdcd LIKE '%0'
    AND COALESCE(p.prd_kodetag, '-') NOT IN ('N', 'O', 'A', 'X', 'H')
    AND COALESCE(p.prd_flagigr, 'N') = 'Y'
ORDER BY
    p.prd_kodedivisi,
    p.prd_kodedepartement,
    p.prd_kodekategoribarang,
    p.prd_prdcd
    `;
};
