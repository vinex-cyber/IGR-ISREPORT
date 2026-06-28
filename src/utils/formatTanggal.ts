// src/utils/formatTanggal.ts

// Base: ambil bagian tanggal tanpa shift UTC
function extractDateParts(input: Date | string | undefined | null) {
  if (!input) return null;
  const date = input instanceof Date ? input : new Date(input);
  if (isNaN(date.getTime())) return null;

  return {
    dd: String(date.getDate()).padStart(2, "0"),
    mm: String(date.getMonth() + 1).padStart(2, "0"),
    yyyy: String(date.getFullYear()),
  };
}

// Untuk tampilan user → DD-MM-YYYY
export function FormatTanggal(input: Date | string | undefined | null): string {
  const parts = extractDateParts(input);
  if (!parts) return "";
  return `${parts.dd}-${parts.mm}-${parts.yyyy}`;
}

// Untuk input HTML & API → YYYY-MM-DD
export function FormatTanggalISO(
  input: Date | string | undefined | null,
): string {
  const parts = extractDateParts(input);
  if (!parts) return "";
  return `${parts.yyyy}-${parts.mm}-${parts.dd}`;
}
