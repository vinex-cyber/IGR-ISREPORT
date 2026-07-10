// src/hooks/useLookupData.ts

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

const COOKIE_NAME = "selected_branch";

function getBranchFromCookie(): string {
  if (typeof window === "undefined") return "";

  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${COOKIE_NAME}=`));

  return cookie ? decodeURIComponent(cookie.split("=")[1] ?? "") : "";
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

  const [branch, setBranch] = useState("");

  // ==========================================
  // Deteksi perubahan branch
  // ==========================================
  useEffect(function detectBranchChange() {
    if (typeof window === "undefined") return;

    setBranch(getBranchFromCookie());

    const timer = window.setInterval(() => {
      const current = getBranchFromCookie();

      setBranch((prev) => {
        if (prev === current) return prev;

        cacheRef.current.clear();

        return current;
      });
    }, 300);

    return function cleanupBranchPolling() { clearInterval(timer); };
  }, []);

  const extraParamsKey = useMemo(
    () =>
      Object.entries(extraParams ?? {})
        .sort(([a], [b]) => a.localeCompare(b))
        .map(
          ([k, v]) =>
            `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
        )
        .join("&"),
    [extraParams],
  );

  const fetchData = useCallback(
    async (
      requestUrl: string,
      cacheKey: string,
      controller: AbortController,
    ) => {
      const cached = cacheRef.current.get(cacheKey);

      if (cached) {
        setData(cached.data ?? []);
        setTotal(cached.total ?? cached.data.length);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await fetch(requestUrl, {
          signal: controller.signal,
          credentials: "same-origin",
        });

        // ==========================
        // 404 = Data kosong
        // ==========================
        if (response.status === 404) {
          const empty: ApiResult<T> = {
            data: [],
            total: 0,
          };

          cacheRef.current.set(cacheKey, empty);

          setData([]);
          setTotal(0);

          return;
        }

        if (!response.ok) {
          throw new Error(`Status ${response.status}`);
        }

        const result = (await response.json()) as ApiResult<T>;

        if (controller.signal.aborted) return;

        cacheRef.current.set(cacheKey, result);

        setData(result.data ?? []);
        setTotal(result.total ?? result.data.length);
      } catch (error) {
        if (controller.signal.aborted) return;

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

  useEffect(function fetchLookupData() {
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

    let requestUrl = endpoint;

    if (mode === "server") {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        search,
      });

      Object.entries(extraParams ?? {}).forEach(([k, v]) => {
        params.set(k, String(v));
      });

      requestUrl = `${endpoint}${
        endpoint.includes("?") ? "&" : "?"
      }${params.toString()}`;
    }

    // Cache dipisahkan berdasarkan branch
    const cacheKey = `${requestUrl}|${branch}`;

    void fetchData(requestUrl, cacheKey, controller);

    return function abortLookupRequest() { controller.abort(); };
  }, [
    endpoint,
    mode,
    page,
    pageSize,
    search,
    minSearch,
    extraParamsKey,
    branch,
    fetchData,
    extraParams,
  ]);

  return {
    data,
    total,
    loading,
  };
}
