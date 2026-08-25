// src/utils/formatTanggal.ts

import { format, isValid, parseISO } from "date-fns";

function toDate(input: Date | string | undefined | null): Date | null {
  if (!input) return null;
  const date = input instanceof Date ? input : parseISO(input);
  return isValid(date) ? date : null;
}

// Untuk tampilan user → DD-MM-YYYY
export function FormatTanggal(input: Date | string | undefined | null): string {
  const date = toDate(input);
  if (!date) return "";
  return format(date, "dd-MM-yyyy");
}

// Untuk input HTML & API → YYYY-MM-DD
export function FormatTanggalISO(
  input: Date | string | undefined | null,
): string {
  const date = toDate(input);
  if (!date) return "";
  return format(date, "yyyy-MM-dd");
}
