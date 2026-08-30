// src/pages/klik/components/format.ts

export const formatRupiah = (value: number): string =>
  Math.round(value).toLocaleString("id-ID");
