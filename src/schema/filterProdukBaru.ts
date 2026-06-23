// src/schema/filterProdukBaru.ts

import { z } from "zod";
import { DATABASE_OPTIONS } from "@/configs/database-options";

const DATABASE_VALUES = new Set(DATABASE_OPTIONS.map((option) => option.value));

const dateSchema = z
  .string()
  .trim()
  .min(1, "Tanggal wajib diisi")
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD");

export const FilterProdukBaruSchema = z
  .object({
    startDate: dateSchema,

    endDate: dateSchema,

    div: z.string().trim().optional(),
    dept: z.string().trim().optional(),
    katb: z.string().trim().optional(),

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
