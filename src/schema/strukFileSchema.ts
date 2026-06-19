import { z } from "zod";

const isValidDate = (value: string): boolean => {
  const [day, month, year] = value.split("-").map(Number);

  if (!day || !month || !year) {
    return false;
  }

  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

export const StrukFileQuerySchema = z.object({
  tanggal: z
    .string({
      required_error: "Tanggal wajib diisi",
    })
    .trim()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "Format tanggal harus DD-MM-YYYY")
    .refine(isValidDate, {
      message: "Tanggal tidak valid",
    }),

  station: z
    .string({
      required_error: "Station wajib diisi",
    })
    .trim()
    .regex(/^\d{2}$/, {
      message: "Station harus terdiri dari 2 digit",
    }),

  struk: z
    .string({
      required_error: "Nomor struk wajib diisi",
    })
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9]+$/, {
      message: "Nomor struk hanya boleh berisi huruf dan angka",
    })
    .min(1, "Nomor struk tidak boleh kosong")
    .max(50, "Nomor struk terlalu panjang"),
});

export type StrukFileQueryInput = z.infer<typeof StrukFileQuerySchema>;
