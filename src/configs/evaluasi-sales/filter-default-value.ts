// src/configs/evaluasi-sales/filter-default-values.ts

import type { FilterDetailStrukInput } from "@/schema/filterDetailStruk";
import { DATABASE_OPTIONS } from "@/configs/database-options";

const getToday = (): string => {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - offset).toISOString().split("T")[0];
};

const getDefaultBranch = (): string => {
  const envBranch = process.env.NEXT_PUBLIC_APP_NAME;

  const branchFromEnv = DATABASE_OPTIONS.find(
    (option) => option.value === envBranch,
  );

  return branchFromEnv?.value ?? DATABASE_OPTIONS[0]?.value ?? "";
};

export const getFilterDetailStrukDefaultValues =
  (): FilterDetailStrukInput => ({
    startDate: getToday(),
    endDate: getToday(),

    noMember: "",
    namaMember: "",

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
    branch: getDefaultBranch(),
  });
