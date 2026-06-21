// src/schema/filterFormSoHarian.ts

import { z } from "zod";
import { DATABASE_OPTIONS } from "@/configs/database-options";

const DATABASE_VALUES = new Set(DATABASE_OPTIONS.map((option) => option.value));

export const FilterFormSoHarianSchema = z.object({
  prdcd: z.string().trim().min(1, "PLU tidak boleh kosong"),

  branch: z
    .string()
    .trim()
    .min(1, "Database wajib dipilih")
    .refine((value) => DATABASE_VALUES.has(value), {
      message: "Database tidak valid",
    }),
});

export type FilterFormSoHarianInput = z.infer<typeof FilterFormSoHarianSchema>;
