import { z } from "zod";

export const FilterFormSoHarianSchema = z.object({
  prdcd: z.string().min(1, "PLU tidak boleh kosong"),
  branch: z.enum(["IGRCPG", "ICMCPG", "SPICPG1I", "SPICPG4L"]).optional(),
  // Tambahkan fields lain sesuai kebutuhan
});

export type FilterFormSoHarianInput = z.infer<typeof FilterFormSoHarianSchema>;
