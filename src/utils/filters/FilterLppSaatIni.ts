// src/utils/filters/FilterLppSaatIni.ts

import { FilterLppSaatIniInput } from "@/schema/filterLppSaatIni";
import { normalizeToArray } from "../normalizeToArray";
import { QueryParam } from "@/types/queryParams";

interface FilterLppSaatIniResult {
  conditions: string;
  params: QueryParam[];
}

export const buildFilterLppSaatIni = (
  filters: FilterLppSaatIniInput,
): FilterLppSaatIniResult => {
  const conditions: string[] = [];
  const params: (string | string[])[] = [];

  // Filter Lokasi
  if (filters.lokasi) {
    conditions.push(`stk.st_lokasi = $${params.length + 1}`);
    params.push(filters.lokasi);
  }

  // Filter Kode Produk
  if (filters.prdcd) {
    conditions.push(
      `prd.prd_prdcd = ANY(string_to_array($${params.length + 1}, ','))`,
    );
    params.push(filters.prdcd);
  }

  // Filter Nama Produk
  if (filters.namaBarang) {
    conditions.push(`prd.prd_deskripsipanjang = $${params.length + 1}`);
    params.push(filters.namaBarang);
  }
  // Filter Kode Monitoring PLU
  if (filters.kodeMonitoringPlu) {
    conditions.push(`dtl_prdcd_ctn = ANY(
                        select mpl_prdcd from tbtr_monitoringplu where mpl_kodemonitoring = $${params.length + 1})
                `);
    params.push(filters.kodeMonitoringPlu);
  }

  // Filter Kode Divisi
  if (filters.div) {
    conditions.push(`prd.prd_kodedivisi = $${params.length + 1}`);
    params.push(filters.div);
  }

  // Filter Kode Departement
  if (filters.dept) {
    conditions.push(`prd.prd_kodedepartement = $${params.length + 1}`);
    params.push(filters.dept);
  }

  // Filter Kode Kategori Barang
  if (filters.katb) {
    conditions.push(`prd.prd_kodekategoribarang = $${params.length + 1}`);
    params.push(filters.katb);
  }

  // Filter kode Tag
  if (filters.tag) {
    conditions.push(`COALESCE(prd.prd_kodetag, ' ') = $${params.length + 1}`);
    params.push(filters.tag);
  }

  // Fiter Kode Supplier
  const kodeSuppliers = normalizeToArray(filters.kodeSupplier);
  if (kodeSuppliers.length > 0) {
    conditions.push(
      `COALESCE(hgb.hgb_kodesupplier, 'Z9999') = ANY($${params.length + 1})`,
    );
    params.push(kodeSuppliers);
  }

  // Filter Nama Supplier
  if (filters.namaSupplier) {
    conditions.push(`hgb.hgb_namasupplier = $${params.length + 1}`);
    params.push(filters.namaSupplier);
  }

  // Filter Status Qty
  if (filters.statusQty) {
    switch (filters.statusQty) {
      case "1":
        conditions.push(`stk.st_saldoakhir < 0`);
        break;
      case "2":
        conditions.push(`stk.st_saldoakhir = 0`);
        break;
      case "3":
        conditions.push(`stk.st_saldoakhir > 0`);
        break;
      case "4":
        conditions.push(`stk.st_saldoakhir < spd.spd_qty * 3`);
        break;
      case "5":
        conditions.push(`stk.st_saldoakhir < pkm.pkm_pkmt`);
        break;
    }
  }

  if (filters.statusTag) {
    conditions.push(
      `CASE WHEN COALESCE(prd.prd_kodetag, ' ') IN ('A','R','N','H','O','T','X') THEN 'Discontinue' ELSE 'Active' END = $${params.length + 1}`,
    );
    params.push(filters.statusTag);
  }

  return {
    conditions: conditions.length > 0 ? conditions.join("\nAND ") : "",
    params,
  };
};
