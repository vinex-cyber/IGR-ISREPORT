// /src/utils/filters/FiltersDetailStruk.ts
import { FilterDetailStrukInput } from "@/schema/filterDetailStruk";
import { normalizeToArray } from "@/utils/normalizeToArray";
import { applyStrukFilters } from "./StrukFilters";

export const FilterDetailStruk = (filters: FilterDetailStrukInput) => {
  const conditions = [];
  const params = [];

  // Filter untuk tanggal (startDate dan endDate)
  if (filters.startDate && filters.endDate) {
    conditions.push(`
        dtl_tanggal >= $${params.length + 1}
        AND dtl_tanggal < $${params.length + 2}
    `);

    params.push(`${filters.startDate} 00:00:00`, `${filters.endDate} 23:59:59`);
  } else {
    if (filters.startDate) {
      conditions.push(`dtl_tanggal >= $${params.length + 1}`);
      params.push(`${filters.startDate} 00:00:00`);
    }
    if (filters.endDate) {
      conditions.push(`dtl_tanggal < $${params.length + 1}`);
      params.push(`${filters.endDate} 23:59:59`);
    }
  }

  // Filter Kode Member
  if (filters.noMember && filters.noMember !== "") {
    conditions.push(`dtl_cusno = $${params.length + 1}`);
    params.push(filters.noMember);
  }
  // Filter Nama Member
  if (filters.namaMember && filters.namaMember !== "") {
    conditions.push(`dtl_namamember ILIKE $${params.length + 1}`);
    params.push(`%${filters.namaMember}%`);
  }
  // Filter Kategori Member
  if (filters.katMember && filters.katMember !== "") {
    conditions.push(
      `dtl_cusno = ANY(select crm_kodemember from tbmaster_customercrm where crm_idgroupkat = $${params.length + 1})`,
    ); // Tambahkan subquery untuk mengambil crm_kodemember berdasarkan crm_idgroupkat
    params.push(filters.katMember);
  }
  // Filter Kode Divisi
  if (filters.div && filters.div !== "") {
    conditions.push(`dtl_k_div = $${params.length + 1}`);
    params.push(filters.div);
  }

  // Filter Kode Departement
  if (filters.dept && filters.dept !== "") {
    conditions.push(`(dtl_k_div||dtl_k_dept) = $${params.length + 1}`);
    params.push(filters.dept);
  }

  // Filter kode Kategori
  if (filters.kat && filters.kat !== "") {
    conditions.push(`(dtl_k_dept||dtl_k_katb) = $${params.length + 1}`);
    params.push(filters.kat);
  }
  // Filter kode Tag
  if (filters.tag && filters.tag !== "") {
    conditions.push(`dtl_k_tag = $${params.length + 1}`);
    params.push(filters.tag);
  }
  // Filter PLU
  if (filters.prdcd && filters.prdcd !== "") {
    conditions.push(
      `dtl_prdcd_ctn = ANY(string_to_array($${params.length + 1}, ','))`,
    );
    params.push(filters.prdcd);
  }

  if (filters.kodeMonitoringPlu && filters.kodeMonitoringPlu !== "") {
    conditions.push(`dtl_prdcd_ctn = ANY(
                        select mpl_prdcd from tbtr_monitoringplu where mpl_kodemonitoring = $${params.length + 1})
                `);
    params.push(filters.kodeMonitoringPlu);
  }

  // Filter Nama Barang
  if (filters.namaBarang && filters.namaBarang !== "") {
    conditions.push(`dtl_nama_barang LIKE $${params.length + 1}`);
    params.push(`%${filters.namaBarang}%`);
  }

  if (filters.barcode && filters.barcode !== "") {
    conditions.push(
      `dtl_prdcd_ctn = (SELECT substr(brc_barcode,1,6)||'0' FROM tbmaster_barcode WHERE brc_barcode = $${
        params.length + 1
      })`,
    );
    params.push(filters.barcode);
  }

  // Filter Non Tunai
  if (filters.nonTunai === "true") {
    conditions.push(`vir_method ~ '^(ISAKU|GOPAY|SHOPEEPAY|QRIS-)'`);
  }

  // Filter Struk
  applyStrukFilters(filters, conditions, params);

  // Filter Member Khusus
  if (filters.memberKhusus && filters.memberKhusus !== "") {
    conditions.push(`coalesce(dtl_memberkhusus,'N') = $${params.length + 1}`);
    params.push(filters.memberKhusus);
  }
  // Filter Outlet
  if (filters.outlet && filters.outlet !== "") {
    if (filters.outlet === "7") {
      conditions.push(`dtl_tipemember = 'TMI'`);
    } else {
      conditions.push(`dtl_outlet = $${params.length + 1}`);
      params.push(filters.outlet);
    }
  }
  // Filter Sub Outlet
  if (filters.subOutlet && filters.subOutlet !== "") {
    conditions.push(`dtl_suboutlet = $${params.length + 1}`);
    params.push(filters.subOutlet);
  }
  // Filter Cash Back
  const cashbacks = normalizeToArray(filters.cashback);
  if (cashbacks.length > 0) {
    if (cashbacks.length === 1) {
      conditions.push(
        `dtl_struk = ANY(select distinct to_char(tgl_trans,'yyyymmdd')||create_by||trans_no||'S' as cashback_struk from m_promosi_h where kd_promosi = $${params.length + 1})`,
      );
      params.push(cashbacks[0]);
    } else {
      conditions.push(
        `dtl_struk = ANY(select distinct to_char(tgl_trans,'yyyymmdd')||create_by||trans_no||'S' as cashback_struk from m_promosi_h where kd_promosi = ANY($${params.length + 1}))`,
      );
      params.push(cashbacks);
    }
  }

  // Filter Cashback Aktif
  if (filters.cbAktif && filters.cbAktif !== "") {
    conditions.push(
      `dtl_prdcd_ctn = ANY(select cbd_prdcd from tbtr_cashback_dtl where cbd_kodepromosi = $${
        params.length + 1
      })`,
    );
    params.push(filters.cbAktif);
  }
  // Filter Cashback Uc
  if (filters.cbUc && filters.cbUc !== "") {
    conditions.push(
      `dtl_prdcd_ctn = ANY(select cbd_prdcd from tbtr_cashback_dtl where cbd_kodepromosi = $${
        params.length + 1
      })`,
    );
    params.push(filters.cbUc);
  }
  // Filter Cashback Redempoin
  if (filters.cbredempoin && filters.cbredempoin !== "") {
    conditions.push(
      `dtl_prdcd_ctn = ANY(select cbd_prdcd from tbtr_cashback_dtl where cbd_kodepromosi = $${
        params.length + 1
      })`,
    );
    params.push(filters.cbredempoin);
  }
  // Filter Gift
  const gift = normalizeToArray(filters.kodeGift);
  if (gift.length > 0) {
    if (gift.length === 1) {
      conditions.push(
        `dtl_cusno = ANY(select distinct kd_member from m_gift_h where kd_promosi = $${params.length + 1})`,
      );
      params.push(gift[0]);
    } else {
      conditions.push(
        `dtl_cusno = ANY(select distinct kd_member from m_gift_h where kd_promosi = ANY($${params.length + 1}))`,
      );
      params.push(gift);
    }
  }

  // Filter Promo Gift
  if (filters.promo && filters.promo.length > 0) {
    conditions.push(
      `dtl_struk = ANY(select to_char(tgl_trans,'yyyymmdd')||create_by||trans_no||'S' as gift_struk from m_gift_h where kd_promosi = ANY($${
        params.length + 1
      }))`,
    );
    params.push(filters.promo);
  }

  // Filter Kasir
  const kasirs = normalizeToArray(filters.kasir);
  if (kasirs.length > 0) {
    if (kasirs.length === 1) {
      conditions.push(`dtl_kasir = $${params.length + 1}`);
      params.push(kasirs[0]);
    } else {
      conditions.push(`dtl_kasir = ANY($${params.length + 1})`);
      params.push(kasirs);
    }
  }
  // Filter No Trans
  if (filters.noTrans && filters.noTrans !== "") {
    conditions.push(`dtl_no_struk = $${params.length + 1}`);
    params.push(filters.noTrans);
  }
  // Filter Station
  if (filters.station && filters.station !== "") {
    conditions.push(`dtl_stat = $${params.length + 1}`);
    params.push(filters.station);
  }
  // Filter Kasir Type
  if (filters.kasirType && filters.kasirType === "non-kss") {
    conditions.push(`dtl_kasir NOT LIKE 'IK%'`);
  } else if (filters.kasirType && filters.kasirType === "only-kss") {
    conditions.push(`dtl_kasir LIKE 'IK%'`);
  }
  // Filter Methode Type
  if (filters.methodType === "kum") {
    conditions.push(`dtl_method = 'TLM'`);
  } else if (filters.methodType === "virtual") {
    conditions.push(`dtl_method ~ '^(ISAKU|GOPAY|SHOPEEPAY|QRIS-)'`);
  }
  // Filter PLU Larangan
  if (filters.pluLarangan === "non-larangan") {
    conditions.push(
      `dtl_prdcd_ctn not in (select non_prdcd from tbmaster_plunonpromo)`,
    );
  } else if (filters.pluLarangan === "larangan") {
    conditions.push(
      `dtl_prdcd_ctn in (select non_prdcd from tbmaster_plunonpromo)`,
    );
  }
  // Filtert Kode supplier
  const kodeSuppliers = normalizeToArray(filters.kodeSupplier);
  if (kodeSuppliers.length > 0) {
    conditions.push(`hgb_kodesupplier = ANY($${params.length + 1})`);
    params.push(kodeSuppliers);
  }
  // Filtert Nama Supplier
  if (filters.namaSupplier && filters.namaSupplier !== "") {
    conditions.push(`sup_namasupplier like $${params.length + 1}`);
    params.push(`%${filters.namaSupplier}%`);
  }
  // Filtert Monitoring Supplier
  if (filters.monitoringSupplier && filters.monitoringSupplier !== "") {
    conditions.push(`dtl_kodesupplier = ANY(select distinct msu_kodesupplier 
                                           from tbtr_monitoringsupplier 
                                          where msu_kodemonitoring = $${params.length + 1})`);
    params.push(filters.monitoringSupplier);
  }
  // Filtert Monitoring Member
  if (filters.monitoringMember && filters.monitoringMember !== "") {
    conditions.push(
      `dtl_cusno in = ANY(select mem_kodemember from tbtr_monitoringmember where mem_kodemonitoring = ANY($${params.length + 1}))`,
    );
    params.push(filters.monitoringMember);
  }
  return {
    conditions:
      conditions.length > 0 ? `where ${conditions.join(" AND ")}` : "",
    params,
  };
};

// Fungsi untuk mengubah query menjadi objek
export const parseFiltersDetailStruk = (
  query: Partial<FilterDetailStrukInput>,
) => {
  const { ...rest } = query;

  return {
    ...rest,
  };
};
