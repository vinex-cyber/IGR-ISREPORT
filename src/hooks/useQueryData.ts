import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/lib/axiosClient";

interface UseQueryDataOptions {
  endpoint: string;
  queryParams?: Record<string, string | number | boolean>;
  enabled?: boolean;
  staleTime?: number;
}

export function useQueryData<T>({
  endpoint,
  queryParams,
  enabled = true,
  staleTime = 1000 * 60 * 5, // ⏱️ cache 5 menit
}: UseQueryDataOptions) {
  return useQuery<T>({
    queryKey: [endpoint, queryParams], // 🔥 cache key
    queryFn: async () => {
      const res = await axiosClient.get(endpoint, {
        params: queryParams,
      });
      return res.data.data;
    },
    enabled,
    staleTime,
  });
}
