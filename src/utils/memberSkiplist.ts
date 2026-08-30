// src/utils/memberSkiplist.ts
// Skiplist kode member dari env MEMBER_MDIH (koma-separated) — dipakai untuk
// mengecualikan member MDIH dari agregat Klik (produk terlaris, sales harian, dsb).
// Kode member di DB kapital, jadi tidak di-lowercase — banding case-sensitive
// sesuai nilai env.
export const getMemberSkiplist = (): string[] =>
  (process.env.MEMBER_MDIH ?? "")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);
