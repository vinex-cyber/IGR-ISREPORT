// src/schema/filterProdukBaru.ts

import { z } from "zod";

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
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "Tanggal akhir tidak boleh lebih kecil dari tanggal awal",
    path: ["endDate"],
  });

export type FilterProdukBaruInput = z.infer<typeof FilterProdukBaruSchema>;
