import type { NextApiRequest, NextApiResponse } from "next";
import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

const StrukQuerySchema = z.object({
  tanggal: z
    .string()
    .trim()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "Format tanggal harus DD-MM-YYYY"),

  station: z
    .string()
    .trim()
    .regex(/^\d{2}$/, "Station harus terdiri dari 2 digit"),

  kasir: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^(\d{3}|IK[1-3])$/, "Kasir harus 3 digit atau IK1, IK2, IK3"),

  struk: z
    .string()
    .trim()
    .toUpperCase()
    .min(1, "Struk wajib diisi")
    .max(40, "Struk terlalu panjang")
    .regex(/^[A-Z0-9]+$/, "Struk hanya boleh berisi huruf dan angka"),
});

interface StrukSuccessResponse {
  success: true;
  data: {
    content: string;
    filename: string;
    folder: string;
    station: string;
    kasir: string;
    isIkiosk: boolean;
  };
}

interface StrukErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[] | undefined>;
}

type StrukResponse = StrukSuccessResponse | StrukErrorResponse;

const STRUK_DIRECTORY =
  process.env.STRUK_DIRECTORY_IGR ?? "\\\\192.168.226.194\\d\\GROSIR\\STRUK";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StrukResponse>,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);

    return res.status(405).json({
      success: false,
      message: "Method tidak diizinkan",
    });
  }

  const parsedQuery = StrukQuerySchema.safeParse({
    tanggal: req.query.tanggal,
    station: req.query.station,
    kasir: req.query.kasir,
    struk: req.query.struk,
  });

  if (!parsedQuery.success) {
    return res.status(400).json({
      success: false,
      message: "Parameter struk tidak valid",
      errors: parsedQuery.error.flatten().fieldErrors,
    });
  }

  const { tanggal, station, kasir, struk } = parsedQuery.data;

  const [day, month, year] = tanggal.split("-");

  // 19-06-2026 menjadi 20260619
  const folderTanggal = `${year}${month}${day}`;

  // Nomor struk dari database sudah lengkap.
  // Contoh:
  // 2026061921700001S.TXT
  // 20260619IK100001S.TXT
  const filename = `${struk}.TXT`;

  const isIkiosk = ["IK1", "IK2", "IK3"].includes(kasir);

  const filePath = isIkiosk
    ? path.win32.join(
        STRUK_DIRECTORY,
        "IKIOSK",
        folderTanggal,
        station,
        filename,
      )
    : path.win32.join(STRUK_DIRECTORY, folderTanggal, station, filename);

  try {
    const content = await fs.readFile(filePath, "utf8");

    return res.status(200).json({
      success: true,
      data: {
        content,
        filename,
        folder: folderTanggal,
        station,
        kasir,
        isIkiosk,
      },
    });
  } catch (error) {
    const fileError = error as NodeJS.ErrnoException;

    console.error("Gagal membaca struk:", {
      code: fileError.code,
      message: fileError.message,
      filePath,
    });

    if (fileError.code === "ENOENT") {
      return res.status(404).json({
        success: false,
        message: `File ${filename} tidak ditemukan`,
      });
    }

    if (fileError.code === "EACCES" || fileError.code === "EPERM") {
      return res.status(403).json({
        success: false,
        message: "Next.js tidak memiliki izin membaca folder struk",
      });
    }

    return res.status(500).json({
      success: false,
      message: fileError.message || "Gagal membaca file struk",
    });
  }
}
