import { z } from "zod";

export const MonitoringPoProdukStockSchema = z.object({
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
  lokasi: z.string().optional(),
  groupFlag: z.string().optional(),
  selectedReport: z.string().optional(),
});

export type MonitoringPoProdukStockFilters = z.infer<
  typeof MonitoringPoProdukStockSchema
>;
