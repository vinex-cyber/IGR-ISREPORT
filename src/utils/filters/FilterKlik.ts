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
// cus_jenismember='T' DAN obi_attribute2 <> 'TMI'
  conditions.push(`obi_kdmember not in (
    select cus_kodemember from tbmaster_customer where cus_jenismember = 'T')
    and obi_attribute2 <> 'TMI'`);

  return {
    conditions: conditions.length > 0 ? `${conditions.join(" AND ")}` : "",
    params,
  };
};
