// hooks/useFilteredData.ts
import { useMemo } from "react";

/**
 * Hook untuk melakukan filtering data berdasarkan searchTerm dan searchableKeys
 *
 * @param data data yang akan di filter
 * @param searchTerm kata kunci yang akan digunakan untuk filtering
 * @param searchableKeys key yang akan digunakan untuk filtering, jika tidak diisi maka akan menggunakan semua key dari data
 * @returns data yang telah di filter atau undefined jika data tidak ada
 *
 * @param Contoh Cara penggunaan memfilter beberapa kolom yang spesifik
 * const filteredData = useFilteredData(
 *   data ?? undefined,
 *   searchTerm,
 *   ["nama_produk", "kode_produk"]
 * );
 */

export function useFilteredData<T>(
    data: T[] | undefined,
    searchTerm: string,
    searchableKeys?: string[]
): T[] | undefined {
    return useMemo(() => {
        if (!data || !searchTerm) return data;
        const term = searchTerm.toLowerCase();

        return data.filter((row) =>
            (searchableKeys || Object.keys(row as object)).some((key) => {
                const value = row[key as keyof T];
                return String(value).toLowerCase().includes(term);
            })
        );
    }, [data, searchTerm, searchableKeys]);
}

