// src/utils/filters/FilterMasterLokasi.ts

import { MasterLokasiFilters } from "@/schema/inventory/master-lokasi/masterLokasiSchema";
import { normalizeToArray } from "@/utils/normalizeToArray";
import { QueryParam } from "@/types/queryParams";

interface FilterMasterLokasiResult {
  conditions: string;
  params: QueryParam[];
}

export const buildMasterLokasiFilters = (
  filters: MasterLokasiFilters,
): FilterMasterLokasiResult => {
  const conditions: string[] = [];
  const params: (string | string[])[] = [];

  if (filters.prdcd) {
    conditions.push(
      `PRD_PRDCD = ANY(string_to_array($${params.length + 1}, ','))`,
    );
    params.push(filters.prdcd);
  }

  if (filters.namaBarang) {
    conditions.push(`PRD_DESKRIPSIPANJANG ILIKE $${params.length + 1}`);
    params.push(`%${filters.namaBarang}%`);
  }

  if (filters.kodeMonitoringPlu) {
    conditions.push(
      `PRD_PRDCD = ANY(SELECT mpl_prdcd FROM tbtr_monitoringplu WHERE mpl_kodemonitoring = $${params.length + 1})`,
    );
    params.push(filters.kodeMonitoringPlu);
  }

  if (filters.div) {
    conditions.push(`PRD_KODEDIVISI = $${params.length + 1}`);
    params.push(filters.div);
  }

  if (filters.dept) {
    conditions.push(`PRD_KODEDEPARTEMENT = $${params.length + 1}`);
    params.push(filters.dept);
  }

  if (filters.katb) {
    conditions.push(`PRD_KODEKATEGORIBARANG = $${params.length + 1}`);
    params.push(filters.katb);
  }

  if (filters.tag) {
    conditions.push(`COALESCE(PRD_KODETAG, ' ') = $${params.length + 1}`);
    params.push(filters.tag);
  }

  const kodeSuppliers = normalizeToArray(filters.kodeSupplier);
  if (kodeSuppliers.length > 0) {
    conditions.push(
      `COALESCE(HGB_KODESUPPLIER, 'Z9999') = ANY($${params.length + 1})`,
    );
    params.push(kodeSuppliers);
  }

  if (filters.namaSupplier) {
    conditions.push(`sup_namasupplier ILIKE $${params.length + 1}`);
    params.push(`%${filters.namaSupplier}%`);
  }

  return {
    conditions: conditions.length > 0 ? conditions.join("\nAND ") : "1 = 1",
    params,
  };
};
