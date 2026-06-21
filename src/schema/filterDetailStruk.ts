// File: src/type/filterdetailstruk.ts
import { DATABASE_OPTIONS } from "@/configs/database-options";
import { z } from "zod";

const DATABASE_VALUES = new Set(DATABASE_OPTIONS.map((option) => option.value));
// Skema validasi filter menggunakan Zod
export const FilterDetailStrukSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  noMember: z.union([z.string(), z.array(z.string())]).optional(),
  namaMember: z.string().optional(),
  div: z.string().optional(),
  dept: z.string().optional(),
  kat: z.string().optional(),
  tag: z.string().optional(),
  prdcd: z
    .string()
    .optional()
    .refine(
      (v) => {
        if (!v) return true;
        return /^[0-9,]+$/.test(v); // hanya angka & koma
      },
      { message: "Format PLU tidak valid" },
    ),
  kodeMonitoringPlu: z.string().toUpperCase().optional(),
  namaBarang: z.string().optional(),
  barcode: z.string().optional(),
  nonTunai: z.enum(["true", "false"]).optional(),
  struk: z.union([z.string(), z.array(z.string())]).optional(),
  memberKhusus: z.string().optional(),
  outlet: z.string().optional(),
  subOutlet: z.string().optional(),
  katMember: z.string().optional(),
  cashback: z.union([z.string(), z.array(z.string())]).optional(),
  cbAktif: z.string().optional(),
  cbUc: z.string().optional(),
  cbredempoin: z.string().optional(),
  kodeGift: z.string().optional(),
  promo: z.array(z.string()).optional(),
  kasir: z.union([z.string(), z.array(z.string())]).optional(),
  noTrans: z.string().optional(),
  station: z.string().optional(),
  kasirType: z.enum(["non-kss", "only-kss"]).optional(),
  methodType: z.enum(["kum", "virtual"]).optional(),
  pluLarangan: z.enum(["non-larangan", "larangan"]).optional(),
  kodeSupplier: z.union([z.string(), z.array(z.string())]).optional(),
  namaSupplier: z.string().optional(),
  monitoringSupplier: z.string().optional(),
  strukSupplier: z.string().optional(),
  selectedReport: z.string().optional(),
  branch: z
    .string()
    .trim()
    .min(1, "Database wajib dipilih")
    .refine((value) => DATABASE_VALUES.has(value), {
      message: "Database tidak valid",
    }),
});

export type FilterDetailStrukInput = z.infer<typeof FilterDetailStrukSchema>;
