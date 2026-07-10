// schema/store/informasiPromosiSchema.ts
import { z } from "zod";

export const InformasiPromosiSchema = z.object({
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
});

export type InformasiPromosiFilters = z.infer<typeof InformasiPromosiSchema>;
