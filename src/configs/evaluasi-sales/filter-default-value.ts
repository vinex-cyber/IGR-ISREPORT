// src/configs/evaluasi-sales/filter-default-values.ts

import type { FilterDetailStrukInput } from "@/schema/filterDetailStruk";

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
 * Menghasilkan seluruh nilai awal form Evaluasi Sales.
 *
 * @param branch Branch yang sudah dideteksi dari IP client.
 */
export function getFilterDetailStrukDefaultValues(): FilterDetailStrukInput {
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
  };
}
