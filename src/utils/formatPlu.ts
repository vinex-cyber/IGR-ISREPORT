/**
 * Format PLU/PRDCD: pad ke 7 digit, digit terakhir di-force "0"
 * Contoh: "123" → "0000120", "1234567" → "01234560"
 *
 * @param value - string koma-separated (e.g. "123, 456")
 * @param options.validate - jika true, throw error kalau ada non-angka
 * @returns string terformat (e.g. "0000120,0000450")
 */
export function formatPlu(
  value: string,
  options?: { validate?: boolean },
): string {
  const { validate = false } = options ?? {};

  const items = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (validate) {
    const invalid = items.find((item) => !/^\d+$/.test(item));
    if (invalid) {
      throw new Error(
        `PLU tidak valid: ${invalid} (hanya angka diperbolehkan)`,
      );
    }
  }

  return items
    .map((item) => {
      const padded = item.padStart(7, "0");
      return padded.slice(0, 6) + "0";
    })
    .join(",");
}
