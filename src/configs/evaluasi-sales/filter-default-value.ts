// src/configs/evaluasi-sales/filter-default-values.ts

import type { FilterDetailStrukInput } from "@/schema/filterDetailStruk";

import { isDatabaseBranch } from "@/configs/database-options";
import { getDefaultBranch } from "@/utils/getDefaultBranch";

/**
 * Mendapatkan tanggal hari ini dalam format YYYY-MM-DD
 * berdasarkan zona waktu lokal perangkat/server.
 */
function getToday(): string {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - offset).toISOString().split("T")[0];
}

/**
 * Menentukan branch awal.
 *
 * Prioritas:
 * 1. Branch yang dikirim dari server berdasarkan IP client
 * 2. NEXT_PUBLIC_APP_NAME
 * 3. Database pertama dari DATABASE_OPTIONS
 */
function resolveDefaultBranch(branch?: string): string {
  const normalizedBranch = branch?.trim();

  if (isDatabaseBranch(normalizedBranch)) {
    return normalizedBranch;
  }

  return getDefaultBranch();
}

/**
 * Menghasilkan seluruh nilai awal form Evaluasi Sales.
 *
 * @param branch Branch yang sudah dideteksi dari IP client.
 */
export function getFilterDetailStrukDefaultValues(
  branch?: string,
): FilterDetailStrukInput {
  const today = getToday();

  return {
    startDate: today,
    endDate: today,

    noMember: "",
    namaMember: "",
    monitoringMember: "",

    div: "",
    dept: "",
    kat: "",
    tag: "",

    prdcd: "",
    kodeMonitoringPlu: "",
    namaBarang: "",
    barcode: "",

    nonTunai: undefined,

    struk: "",
    memberKhusus: "",
    outlet: "",
    subOutlet: "",
    katMember: "",

    cashback: [],
    cbAktif: "",
    cbUc: "",
    cbredempoin: "",
    kodeGift: "",

    promo: [],

    kasir: [],
    noTrans: "",
    station: "",

    kasirType: undefined,
    methodType: undefined,
    pluLarangan: undefined,

    kodeSupplier: [],
    namaSupplier: "",
    monitoringSupplier: "",
    strukSupplier: "",

    selectedReport: "per-divisi",

    branch: resolveDefaultBranch(branch),
  };
}
