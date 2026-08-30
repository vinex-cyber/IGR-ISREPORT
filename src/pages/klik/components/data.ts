// src/pages/klik/components/data.ts
// ponytail: data di bawah DUMMY/statis untuk preview tampilan.
// Saat query/API 'Klik' dijelaskan, ganti konstanta DUMMY_* dengan useFetchData.

export type Kpi = {
  key: string;
  label: string;
  value: number;
  prefix?: string;
  delta: number;
  icon: string;
  accent: string;
  tint: string;
};

export type Metode = {
  label: string;
  value: number;
  percent: number;
  color: string;
};

export type TrendRow = {
  label: string;
  omzet: number;
  trx: number;
  omzet2: number;
  trx2: number;
};

export const DUMMY_KPI: Kpi[] = [
  { key: "omzet", label: "Total Omset", value: 485_000_000, delta: 12.4, icon: "banknote", accent: "text-chart-1", tint: "from-chart-1/15" },
  { key: "transaksi", label: "Transaksi", value: 12_840, delta: 8.1, icon: "receipt", accent: "text-chart-2", tint: "from-chart-2/15" },
  { key: "qty", label: "Qty Terjual", value: 96_320, delta: 5.6, icon: "package", accent: "text-chart-3", tint: "from-chart-3/15" },
  { key: "aov", label: "Rata-rata / Transaksi", value: 37_772, delta: 3.9, icon: "shopping", accent: "text-chart-4", tint: "from-chart-4/15" },
  { key: "member", label: "Member Aktif", value: 3_240, delta: -1.8, icon: "users", accent: "text-yellow-600 dark:text-yellow-400", tint: "from-yellow-500/15" },
];

export const DUMMY_TREND: TrendRow[] = [
  { label: "01", omzet: 12.8, trx: 320, omzet2: 10.1, trx2: 240 },
  { label: "05", omzet: 14.2, trx: 355, omzet2: 11.0, trx2: 260 },
  { label: "09", omzet: 13.0, trx: 330, omzet2: 12.4, trx2: 290 },
  { label: "13", omzet: 18.9, trx: 470, omzet2: 13.1, trx2: 310 },
  { label: "17", omzet: 21.4, trx: 520, omzet2: 14.8, trx2: 340 },
  { label: "21", omzet: 19.6, trx: 490, omzet2: 15.2, trx2: 370 },
  { label: "25", omzet: 24.8, trx: 610, omzet2: 16.9, trx2: 400 },
  { label: "29", omzet: 27.3, trx: 690, omzet2: 18.0, trx2: 430 },
];

export const DUMMY_METODE: Metode[] = [
  { label: "E-Wallet", value: 182_000_000, percent: 38, color: "bg-chart-1" },
  { label: "Virtual Account", value: 141_000_000, percent: 29, color: "bg-chart-2" },
  { label: "COD", value: 97_000_000, percent: 20, color: "bg-chart-3" },
  { label: "Transfer Bank", value: 65_000_000, percent: 13, color: "bg-chart-4" },
];
