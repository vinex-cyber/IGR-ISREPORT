import type { ColumnConfig } from "@/types/report";

export type PromoMendatangRows = {
  kd_promo: string;
  nama_promo: string;
  plu_promo: string;
  deskripsi_promo: string;
  tglawal_promo: string;
  tglakhir_promo: string;
  flag_promo: string;
  jenis_mem: string;
};

const joinFlags = (row: Record<string, unknown>) =>
  ["igr", "klik", "spi", "tmi"]
    .filter((f) => row[`flag${f}`] === "Y")
    .map((f) => f.toUpperCase())
    .join(", ");

const joinMember = (row: Record<string, unknown>) => {
  const jenis: string[] = [];
  if (row.mm_reguler === "1" || row.mm_reguler_biruplus === "1")
    jenis.push("Mb");
  if (
    row.mm_retailer === "1" ||
    row.mm_silver === "1" ||
    row.mm_gold1 === "1" ||
    row.mm_gold2 === "1" ||
    row.mm_gold3 === "1"
  )
    jenis.push("Mm");
  if (row.mm_platinum === "1") jenis.push("Pla");
  return jenis.join(", ");
};

export const promoMendatangColumns: ColumnConfig<PromoMendatangRows>[] = [
  { field: "kd_promo", label: "KODE", isSearchable: true },
  { field: "nama_promo", label: "NAMA PROMOSI", isSearchable: true },
  { field: "plu_promo", label: "PLU", isSearchable: true },
  { field: "deskripsi_promo", label: "DESKRIPSI", isSearchable: true },
  { field: "tglawal_promo", label: "TGL AWAL" },
  { field: "tglakhir_promo", label: "TGL AKHIR" },
  {
    field: "flag_promo",
    label: "FLAG PROMO",
    render: (_, row) => joinFlags(row) || "-",
  },
  {
    field: "jenis_mem",
    label: "JENIS MEM",
    render: (_, row) => joinMember(row) || "-",
  },
];
