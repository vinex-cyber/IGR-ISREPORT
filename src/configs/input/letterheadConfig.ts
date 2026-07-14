// src/configs/input/letterheadConfig.ts

import { getBranchPrefix, type BranchPrefix } from "@/utils/getBranchTheme";

export interface LetterheadInfo {
  /** Nama perusahaan (tampil sebagai judul kop surat). */
  name: string;
  /** Alamat lengkap + telp + email. */
  address: string;
  /** Kode singkatan untuk nomor surat, mis. "IGR-CPG". */
  nomorCode: string;
}

/**
 * Data kop surat per nilai branch penuh
 * (IGRCPG / ICMCPG / SPICPG1I / SPICPG4L).
 * Lengkapi placeholder sesuai data resmi.
 */
const LETTERHEAD_BY_BRANCH: Record<string, LetterheadInfo> = {
  IGRCPG: {
    name: "INDOGROSIR CIPINANG",
    address:
      "Alamat : Komplek Pasar Induk Beras Cipinang, Jl. Pisangan Lama Tim. No.1, RT.9/RW.9, Pisangan Tim., Kec. Pulo Gadung, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13230. \nTelp: (021) 4706455 | (wa) 0852-8571-2885 | klikindogrosir.com | indogrosir.co.id",
    nomorCode: "IGR-CPG",
  },
  ICMCPG: {
    name: "ICM CIPINANG",
    address:
      "Alamat : Komplek Pasar Induk Beras Cipinang, Jl. Pisangan Lama Tim. No.1, RT.9/RW.9, Pisangan Tim., Kec. Pulo Gadung, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13230. \nTelp: (021) 4706455 | (wa) 0852-8571-2885 | klikindogrosir.com | indogrosir.co.id",
    nomorCode: "ICM-CPG",
  },
  SPICPG1I: {
    name: "SPI CILEUNGSI 1I",
    address:
      "Jl. Raya Cileungsi - Jonggol Kp. Panangga No.RT 1/5 KM 7, Gandoang, Cileungsi, Bogor Regency, West Java 16820 | \n(wa) 0852-8571-2885 | klikindogrosir.com | indogrosir.co.id",
    nomorCode: "SPI-CPG1I",
  },
  SPICPG4L: {
    name: "SPI JATISARI 4L",
    address:
      "GG. SENI - PAYANGAN, Jl. Wibawa Mukti II, RT.07/RW.006, Jatisari, Kec. Jatiasih, Kota Bks, Jawa Barat 17426  |\nwa: 0822-4635-7337 | klikindogrosir.com | indogrosir.co.id/",
    nomorCode: "SPI-CPG4L",
  },
};

/**
 * Fallback berbasis prefix bila nilai branch tidak dikenal.
 */
const LETTERHEAD_BY_PREFIX: Record<BranchPrefix, LetterheadInfo> = {
  IGR: LETTERHEAD_BY_BRANCH.IGRCPG,
  ICM: LETTERHEAD_BY_BRANCH.ICMCPG,
  SPI: LETTERHEAD_BY_BRANCH.SPICPG1I,
  OTHER: {
    name: "NAMA PERUSAHAAN",
    address:
      "Alamat Perusahaan | Telp: (000) 000-000 | Email: info@perusahaan.co.id",
    nomorCode: "CPG",
  },
};

/**
 * Mengambil data kop surat berdasarkan branch aktif.
 * Prioritas: cocok penuh → fallback prefix.
 */
export function getLetterheadInfo(branch?: string): LetterheadInfo {
  const key = branch?.trim().toUpperCase();
  if (key && LETTERHEAD_BY_BRANCH[key]) {
    return LETTERHEAD_BY_BRANCH[key];
  }
  return LETTERHEAD_BY_PREFIX[getBranchPrefix(branch)];
}
