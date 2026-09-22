// Kolom base SELECT DISTINCT transaksi jual yang dipakai untuk menghitung
// margin live bulan berjalan, sama persis dengan granularity DetailStruk
// (report evaluasi sales per bulan). Dipakai bersama oleh query trend agar
// granularity tidak menyimpang antar chart.
export const JUALDETAIL_DISTINCT_BASE = `
        trjd_kodeigr, trjd_recordid, trjd_transactionno, trjd_seqno,
        trjd_prdcd, trjd_flaggoodsnodisc, trjd_flagtax1, trjd_flagtax2,
        trjd_quantity, trjd_unitprice, trjd_discount, trjd_nominalamt,
        trjd_divisioncode, trjd_division, trjd_baseprice, trjd_cus_kodemember,
        trjd_prd_deskripsipendek, trjd_create_by, trjd_create_dt,
        trjd_modify_by, trjd_modify_dt, trjd_admfee, trjd_cashierstation,
        trjd_transactiondate, trjd_transactiontype,
        trjd_noinvoice1::text AS trjd_noinvoice1,
        trjd_noinvoice2::text AS trjd_noinvoice2, p_qty`;