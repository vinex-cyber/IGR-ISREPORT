// src/hooks/useFetchData.ts
import { useState, useEffect, useMemo, useCallback } from "react";
import axiosClient from "@/lib/axiosClient";

interface UseFetchDataOptions {
  endpoint: string;
  queryParams?: Record<string, string | number | boolean>;
  enabled?: boolean;
}

interface FetchDataResult<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  total: number;
  totalPages: number;
  page: number;
  refetch: () => Promise<void>;
}

export function useFetchData<T>({
  endpoint,
  queryParams,
  enabled = true,
}: UseFetchDataOptions): FetchDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState<number>(1);

  const paramsString = useMemo(
    () => (queryParams ? JSON.stringify(queryParams) : ""),
    [queryParams],
  );

  const stableParams = useMemo(
    () =>
      paramsString
        ? (JSON.parse(paramsString) as Record<
            string,
            string | number | boolean
          >)
        : undefined,
    [paramsString],
  );

  const fetchData = useCallback(async () => {
    if (!endpoint) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axiosClient.get(endpoint, {
        params: stableParams,
      });

      setData(response.data.data);
      setTotal(response.data.total ?? 0);
      setTotalPages(response.data.totalPages ?? 1);
      setPage(response.data.page ?? 1);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Fetch error:", err.message);
        setError(err.message);
      } else {
        console.error("Unknown error", err);
        setError("Unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [endpoint, stableParams]);

  useEffect(() => {
    if (!enabled) return;
    fetchData();
  }, [endpoint, stableParams, enabled, fetchData]);

  return { data, error, loading, total, totalPages, page, refetch: fetchData };
}
