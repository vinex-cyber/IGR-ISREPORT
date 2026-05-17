// src/hooks/useLookupData.ts

import { useEffect, useRef, useState } from "react";

type Mode = "client" | "server";

interface UseLookupDataProps {
  endpoint: string;
  mode?: Mode;
  page: number;
  pageSize: number;
  search: string;

  extraParams?: Record<string, string | number | boolean>; // 🔥 tambahan
  minSearch?: number; // 🔥 tambahan
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
  extraParams = {},
  minSearch = 0,
}: UseLookupDataProps) {
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // 🔥 cache sederhana
  const cacheRef = useRef<Map<string, ApiResult<T>>>(new Map());

  const fetchData = async (url: string, controller: AbortController) => {
    // ✅ cek cache dulu
    if (cacheRef.current.has(url)) {
      const cached = cacheRef.current.get(url)!;
      setData(cached.data ?? []);
      setTotal(cached.total ?? cached.data?.length ?? 0);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(url, { signal: controller.signal });
      const json = (await res.json()) as ApiResult<T>;

      // simpan cache
      cacheRef.current.set(url, json);

      setData(json.data ?? []);
      setTotal(json.total ?? json.data?.length ?? 0);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Lookup fetch error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // 🔥 CLIENT MODE
  // =========================
  useEffect(() => {
    if (mode !== "client") return;

    const controller = new AbortController();
    fetchData(endpoint, controller);

    return () => controller.abort();
  }, [endpoint, mode]);

  // =========================
  // 🔥 SERVER MODE
  // =========================
  useEffect(() => {
    if (mode !== "server") return;

    // 🚫 skip kalau search belum cukup
    if (search.length < minSearch) {
      setData([]);
      setTotal(0);
      return;
    }

    const controller = new AbortController();

    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      search,
      ...Object.fromEntries(
        Object.entries(extraParams).map(([k, v]) => [k, String(v)]),
      ),
    });

    const separator = endpoint.includes("?") ? "&" : "?";

    const url = `${endpoint}${separator}${params.toString()}`;

    fetchData(url, controller);

    return () => controller.abort();
  }, [endpoint, mode, page, pageSize, search, extraParams, minSearch]);

  return { data, total, loading };
}

// import { useEffect, useState } from "react";

// type Mode = "client" | "server";

// interface UseLookupDataProps {
//     endpoint: string;
//     mode?: Mode;
//     page: number;
//     pageSize: number;
//     search: string;
// }

// interface ApiResult<T> {
//     data: T[];
//     total?: number;
// }

// export function useLookupData<T>({
//     endpoint,
//     mode = "client",
//     page,
//     pageSize,
//     search,
// }: UseLookupDataProps) {
//     const [data, setData] = useState<T[]>([]);
//     const [total, setTotal] = useState<number>(0);
//     const [loading, setLoading] = useState<boolean>(false);

//     // 🔥 function fetch reusable
//     const fetchData = async (url: string, controller: AbortController) => {
//         setLoading(true);
//         try {
//             const res = await fetch(url, { signal: controller.signal });
//             const json = (await res.json()) as ApiResult<T>;

//             setData(json.data ?? []);
//             setTotal(json.total ?? json.data?.length ?? 0);
//         } catch (err) {
//             if ((err as Error).name !== "AbortError") {
//                 console.error("Lookup fetch error:", err);
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     // =========================
//     // 🔥 CLIENT MODE (fetch sekali)
//     // =========================
//     useEffect(() => {
//         if (mode !== "client") return;

//         const controller = new AbortController();
//         fetchData(endpoint, controller);

//         return () => controller.abort();
//     }, [endpoint, mode]);

//     // =========================
//     // 🔥 SERVER MODE (depend on page/search)
//     // =========================
//     useEffect(() => {
//         if (mode !== "server") return;

//         const controller = new AbortController();

//         const params = new URLSearchParams({
//             page: String(page),
//             pageSize: String(pageSize),
//             search,
//         });

//         const url = `${endpoint}?${params.toString()}`;

//         fetchData(url, controller);

//         return () => controller.abort();
//     }, [endpoint, mode, page, pageSize, search]);

//     return { data, total, loading };
// }
