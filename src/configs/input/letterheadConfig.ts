// src/configs/input/letterheadConfig.ts

import { getBranchPrefix, type BranchPrefix } from "@/utils/getBranchTheme";

export interface LetterheadInfo {
  /** Nama singkat branch (mis. "CIPINANG"). */
  name: string;
  /** Nama lengkap perusahaan (tampil sebagai judul kop surat). */
  perusahaan: string;
  /** Alamat lengkap + telp + email. */
  address: string;
  /** Kode singkatan untuk nomor surat, mis. "IGR-CPG". */
  nomorCode: string;
}

interface RawLetterheadEntry extends Record<string, unknown> {
  branch: string;
  name: string;
  perusahaan: string;
  address: string;
  nomorCode: string;
}

/**
 * Memeriksa apakah sebuah nilai merupakan entri kop surat yang valid.
 */
function isLetterheadEntry(value: unknown): value is RawLetterheadEntry {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const entry = value as Record<string, unknown>;

  return (
    typeof entry.branch === "string" &&
    entry.branch.trim().length > 0 &&
    typeof entry.name === "string" &&
    entry.name.trim().length > 0 &&
    typeof entry.perusahaan === "string" &&
    entry.perusahaan.trim().length > 0 &&
    typeof entry.address === "string" &&
    typeof entry.nomorCode === "string" &&
    entry.nomorCode.trim().length > 0
  );
}

/**
 * Membaca konfigurasi kop surat per branch dari environment variable.
 *
 * Contoh isi .env.local:
 *
 * NEXT_PUBLIC_LETTERHEAD_BRANCHES=[
 *   {
 *     "branch": "IGRCPG",
 *     "name": "INDOGROSIR CIPINANG",
 *     "address": "Alamat : Komplek Pasar Induk Beras Cipinang, Jl. Pisangan Lama Tim. No.1, RT.9/RW.9, Pisangan Tim., Kec. Pulo Gadung, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13230. \nTelp: (021) 4706455 | (wa) 0852-8571-2885 | klikindogrosir.com | indogrosir.co.id",
 *     "nomorCode": "IGR-CPG"
 *   },
 *   {
 *     "branch": "ICMCPG",
 *     "name": "ICM CIPINANG",
 *     "address": "Alamat : Komplek Pasar Induk Beras Cipinang, Jl. Pisangan Lama Tim. No.1, RT.9/RW.9, Pisangan Tim., Kec. Pulo Gadung, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13230. \nTelp: (021) 4706455 | (wa) 0852-8571-2885 | klikindogrosir.com | indogrosir.co.id",
 *     "nomorCode": "ICM-CPG"
 *   },
 *   {
 *     "branch": "SPICPG1I",
 *     "name": "SPI CILEUNGSI 1I",
 *     "address": "Jl. Raya Cileungsi - Jonggol Kp. Panangga No.RT 1/5 KM 7, Gandoang, Cileungsi, Bogor Regency, West Java 16820 | \n(wa) 0852-8571-2885 | klikindogrosir.com | indogrosir.co.id",
 *     "nomorCode": "SPI-CPG1I"
 *   },
 *   {
 *     "branch": "SPICPG4L",
 *     "name": "SPI JATISARI 4L",
 *     "address": "GG. SENI - PAYANGAN, Jl. Wibawa Mukti II, RT.07/RW.006, Jatisari, Kec. Jatiasih, Kota Bks, Jawa Barat 17426  |\nwa: 0822-4635-7337 | klikindogrosir.com | indogrosir.co.id/",
 *     "nomorCode": "SPI-CPG4L"
 *   }
 * ]
 */
function parseLetterheadBranches(): Record<string, LetterheadInfo> {
  const raw = process.env.NEXT_PUBLIC_LETTERHEAD_BRANCHES;

  if (!raw) {
    throw new Error(
      "NEXT_PUBLIC_LETTERHEAD_BRANCHES belum diatur di file .env.local",
    );
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      throw new Error("Format harus berupa array JSON");
    }

    if (parsed.length === 0) {
      throw new Error("Daftar kop surat tidak boleh kosong");
    }

    if (!parsed.every(isLetterheadEntry)) {
      throw new Error("Terdapat entri kop surat yang tidak valid");
    }

    const normalized = parsed.map((entry) => ({
      key: entry.branch.trim().toUpperCase(),
      info: {
        name: entry.name.trim(),
        perusahaan: entry.perusahaan.trim(),
        address: entry.address,
        nomorCode: entry.nomorCode.trim(),
      } satisfies LetterheadInfo,
    }));

    const uniqueKeys = new Set(normalized.map((entry) => entry.key));

    if (uniqueKeys.size !== normalized.length) {
      throw new Error("Terdapat branch kop surat yang duplikat");
    }

    return Object.fromEntries(normalized.map((entry) => [entry.key, entry.info]));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Format tidak diketahui";

    throw new Error(
      `NEXT_PUBLIC_LETTERHEAD_BRANCHES tidak valid: ${message}`,
    );
  }
}

const LETTERHEAD_BY_BRANCH = parseLetterheadBranches();

/**
 * Mengambil entri kop surat pertama yang diawali prefix tertentu.
 */
function firstBranchByPrefix(prefix: string): LetterheadInfo | undefined {
  for (const [key, info] of Object.entries(LETTERHEAD_BY_BRANCH)) {
    if (key.startsWith(prefix)) {
      return info;
    }
  }
  return undefined;
}

/**
 * Fallback berbasis prefix bila nilai branch tidak dikenal.
 * Diambil dari branch pertama yang cocok per prefix.
 */
const LETTERHEAD_BY_PREFIX: Record<BranchPrefix, LetterheadInfo> = {
  IGR: firstBranchByPrefix("IGR") ?? LETTERHEAD_BY_BRANCH[Object.keys(LETTERHEAD_BY_BRANCH)[0]],
  ICM: firstBranchByPrefix("ICM") ?? LETTERHEAD_BY_BRANCH[Object.keys(LETTERHEAD_BY_BRANCH)[0]],
  SPI: firstBranchByPrefix("SPI") ?? LETTERHEAD_BY_BRANCH[Object.keys(LETTERHEAD_BY_BRANCH)[0]],
  OTHER: {
    name: "NAMA PERUSAHAAN",
    perusahaan: "PT. INTI CAKRAWALA CITRA",
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
