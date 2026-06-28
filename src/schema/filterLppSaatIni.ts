// src/schema/filterLppSaatIni.ts
import { z } from "zod";
import { DATABASE_OPTIONS } from "@/configs/database-options";

const DATABASE_VALUES = new Set(DATABASE_OPTIONS.map((option) => option.value));

export const FilterLppSaatIniSchema = z.object({
  prdcd: z
    .string()
    .optional()
    .refine(
      (v) => {
        if (!v) return true;
        return v.split(",").every((item) => /^[0-9]{7}$/.test(item.trim()));
      },
      { message: "Format PLU tidak valid, harus 7 digit angka" },
    ),
  namaBarang: z.string().optional(),
  kodeMonitoringPlu: z.string().toUpperCase().optional(),
  div: z.string().trim().optional(),
  dept: z.string().trim().optional(),
  katb: z.string().trim().optional(),
  tag: z.string().trim().optional(),
  kodeSupplier: z.union([z.string(), z.array(z.string())]).optional(),
  namaSupplier: z.string().optional(),
  statusTag: z.string().optional(),
  statusQty: z.enum(["1", "2", "3", "4", "5"]).optional(),
  lokasi: z.string().optional(),
  groupFlag: z.string().optional(),
  branch: z
    .string()
    .trim()
    .min(1, "Database wajib dipilih")
    .refine((value) => DATABASE_VALUES.has(value), {
      message: "Database tidak valid",
    }),
  selectedReport: z.string().optional(),
});

export type FilterLppSaatIniInput = z.infer<typeof FilterLppSaatIniSchema>;
