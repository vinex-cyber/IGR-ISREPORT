// src/schema/filterFormSoHarian.ts

import { z } from "zod";

export const FilterFormSoHarianSchema = z.object({
  prdcd: z.string().trim().min(1, "PLU tidak boleh kosong"),
});

export type FilterFormSoHarianInput = z.infer<typeof FilterFormSoHarianSchema>;
