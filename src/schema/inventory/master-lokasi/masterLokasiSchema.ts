// schema/inventory/master-lokasi/MasterLokasiSchema.ts
import { z } from "zod";

export const MasterLokasiSchema = z.object({
  search: z.string().trim().optional().default(""),
  // TODO: tambah field filter lain sesuai kebutuhan
  // div: z.string().trim().optional(),
});

export type MasterLokasiFilters = z.infer<typeof MasterLokasiSchema>;
