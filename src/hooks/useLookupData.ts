// src/hooks/useLookupData.ts

import { useCallback, useEffect, useRef, useState } from "react";

type Mode = "client" | "server";

type ExtraParamValue = string | number | boolean;

interface UseLookupDataProps {
  endpoint: string;
  mode?: Mode;
  page: number;
  pageSize: number;
  search: string;
  extraParams?: Record<string, ExtraParamValue>;
  minSearch?: number;
}

interface ApiResult<T> {
  data: T[];
  total?: number;
}

export function useLookupData<T>({
  endpoint,
  mode = "client",
  page,
  pageSize,
  search,
  extraParams,
  minSearch = 0,
}: UseLookupDataProps) {
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const cacheRef = useRef<Map<string, ApiResult<T>>>(new Map());

  /*
   * Membuat dependency primitive agar effect tidak
   * dijalankan ulang hanya karena referensi objek berubah.
   */
  const extraParamsKey = Object.entries(extraParams ?? {})
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
    .join("&");

  const fetchData = useCallback(
    async (url: string, controller: AbortController): Promise<void> => {
      const cachedData = cacheRef.current.get(url);

      if (cachedData) {
        setData(cachedData.data ?? []);
        setTotal(cachedData.total ?? cachedData.data?.length ?? 0);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request gagal dengan status ${response.status}`);
        }

        const result = (await response.json()) as ApiResult<T>;

        if (controller.signal.aborted) {
          return;
        }

        cacheRef.current.set(url, result);

        setData(result.data ?? []);
        setTotal(result.total ?? result.data?.length ?? 0);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        console.error("Lookup fetch error:", error);

        setData([]);
        setTotal(0);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    if (!endpoint) {
      setData([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    if (mode === "server" && search.trim().length < minSearch) {
      setData([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    if (mode === "client") {
      void fetchData(endpoint, controller);

      return () => {
        controller.abort();
      };
    }

    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      search,
    });

    /*
     * extraParams dimasukkan terakhir sehingga tetap
     * mengikuti perilaku kode sebelumnya.
     */
    Object.entries(extraParams ?? {}).forEach(([key, value]) => {
      params.set(key, String(value));
    });

    const separator = endpoint.includes("?") ? "&" : "?";

    const url = `${endpoint}${separator}${params.toString()}`;

    void fetchData(url, controller);

    return () => {
      controller.abort();
    };
  }, [
    endpoint,
    mode,
    page,
    pageSize,
    search,
    minSearch,
    extraParamsKey,
    fetchData,
    extraParams,
  ]);

  return {
    data,
    total,
    loading,
  };
}
