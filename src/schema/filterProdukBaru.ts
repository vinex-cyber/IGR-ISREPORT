// src/schema/filterProdukBaru.ts

import { z } from "zod";
import { DATABASE_OPTIONS } from "@/configs/database-options";

const DATABASE_VALUES = new Set(DATABASE_OPTIONS.map((option) => option.value));

export const FilterProdukBaruSchema = z
  .object({
    startDate: z.string().min(1, "Tanggal awal wajib diisi"),

    endDate: z.string().min(1, "Tanggal akhir wajib diisi"),

    div: z.string().optional(),

    branch: z
      .string()
      .trim()
      .min(1, "Database wajib dipilih")
      .refine((value) => DATABASE_VALUES.has(value), {
        message: "Database tidak valid",
      }),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "Tanggal akhir tidak boleh lebih kecil dari tanggal awal",
    path: ["endDate"],
  });

export type FilterProdukBaruInput = z.infer<typeof FilterProdukBaruSchema>;
