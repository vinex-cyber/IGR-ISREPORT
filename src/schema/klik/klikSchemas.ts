// schema/store/informasiPromosiSchema.ts
import { z } from "zod";

export const klikSchemas = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
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
  status: z.string().optional(),
  typeBayar: z.string().optional(),
  notRecid: z.string().optional(),
  /** "true" = hanya PB recid 5/6 yang belum ada di tbtr_serahterima_ipp */
  belumSerah: z.string().optional(),
});

export type KlikFilters = z.infer<typeof klikSchemas>;
