import { KlikFilters } from "@/schema/klik/klikSchemas";
import { QueryParam } from "@/types/queryParams";
import { normalizeToArray } from "@/utils/normalizeToArray";

export const FilterKlik = (filters: KlikFilters) => {
  const conditions = [];
  const params: QueryParam[] = [];

  // Filter untuk tanggal (startDate dan endDate)
  if (filters.startDate && filters.endDate) {
    conditions.push(`
        obi_tglpb >= $${params.length + 1}
        AND obi_tglpb < $${params.length + 2}
    `);

    params.push(`${filters.startDate} 00:00:00`, `${filters.endDate} 23:59:59`);
  } else {
    if (filters.startDate) {
      conditions.push(`obi_tglpb >= $${params.length + 1}`);
      params.push(`${filters.startDate} 00:00:00`);
    }
    if (filters.endDate) {
      conditions.push(`obi_tglpb < $${params.length + 1}`);
      params.push(`${filters.endDate} 23:59:59`);
    }
  }
  // Filter Kode PLU
  const prdcd = normalizeToArray(filters.prdcd);
  if (prdcd.length > 0) {
    if (prdcd.length === 1) {
      conditions.push(`prdcd = $${params.length + 1}`);
      params.push(prdcd[0]);
    } else {
      conditions.push(`prdcd = ANY($${params.length + 1})`);
      params.push(prdcd);
    }
  }
  // Filter Status PB — pakai obi_recid (bukan kolom CASE 'status' yang teks)
  if (filters.status) {
    conditions.push(`obi_recid = $${params.length + 1}`);
    params.push(filters.status);
  }
  // Belum serah terima: recid 5/6 yang PB-nya belum ada di tbtr_serahterima_ipp.
  // NOT EXISTS (bukan LEFT JOIN ... IS NULL) supaya tidak menggandakan baris.
  // Batas 2 bulan berjalan dikirim caller lewat startDate/endDate — JANGAN taruh
  // `obi_tglpb >= date_trunc(...)` di sini: queryDetailKlik mem-parsing conditions
  // dengan regex `/obi_tglpb\s*(>=|<=|>|<|=)\s*\$(\d+)/` untuk membangun whereObih/
  // whereSub (subquery rokok). Ekspresi tanpa placeholder $N bikin whereSub kosong
  // -> "AND PRD_KODEDIVISI..." nempel tanpa WHERE -> syntax error 500.
  if (filters.belumSerah === "true") {
    // coalesce+btrim: ekspedisi NULL maupun kosong (order Corp/TOP tanpa kurir,
    // mis. '3703556/cor/09/2026') ikut dibuang — bukan lolos diam-diam.
    // Empat pengecualian ini semuanya 0% tercatat di tbtr_serahterima_ipp di
    // semua branch, jadi memang tidak lewat serah terima IPP. JANGAN tambah
    // 'Indopaket Nusantara': 64,7% sudah tercatat (kurir IPP biasa).
    conditions.push(`obi_recid IN ('5','6')
      AND btrim(coalesce(obi_kdekspedisi, '')) NOT IN ('', 'Ambil di Toko Indogrosir', 'Ambil di Stock Point Indogrosir', 'MOBIL ENGKEL/DOUBLE')
      AND NOT EXISTS (
        select 1 from tbtr_serahterima_ipp s
        where s.sti_codpaymentcode = obi_nopb)`);
  }
  // Filter tipe bayar (COD / NON COD)
  if (filters.typeBayar) {
    conditions.push(`obi_tipebayar = $${params.length + 1}`);
    params.push(filters.typeBayar);
  }
  // Filter kecualikan recid — dukung pola LIKE (contoh: notRecid '6,B%')
  const notRecid = normalizeToArray(filters.notRecid);
  if (notRecid.length > 0) {
    const plain = notRecid.filter((v) => !v.includes("%"));
    const patterns = notRecid.filter((v) => v.includes("%"));
    if (plain.length > 0) {
      conditions.push(`obi_recid <> ALL($${params.length + 1})`);
      params.push(plain);
    }
    if (patterns.length > 0) {
      const clauses = patterns.map((pattern) => {
        params.push(pattern);
        return `obi_recid NOT LIKE $${params.length}`;
      });
      conditions.push(clauses.join(" AND "));
    }
  }
  // TMI: sama dengan kartu dashboard cpg-vite (flagTmi='N') — bukan member
  // cus_jenismember='T' DAN obi_attribute2 <> 'TMI'.
  // -> NOT EXISTS (bukannya NOT IN) supaya korelasi per-bar lewat indeks pkey
  //    customer, bukan memindai seluruh tbmaster_customer (~5,7 juta baris).
  conditions.push(`NOT EXISTS (
    select 1 from tbmaster_customer c
    where c.cus_kodemember = obi_kdmember and c.cus_jenismember = 'T')
    and obi_attribute2 <> 'TMI'`);

  return {
    conditions: conditions.length > 0 ? `${conditions.join(" AND ")}` : "",
    params,
  };
};
