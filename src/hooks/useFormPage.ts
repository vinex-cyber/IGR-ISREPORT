// src/hooks/useFormPage.ts
import { useRouter } from "next/router";
import { useCallback } from "react";
import { toast } from "sonner";

interface UseFormSubmitOptions<
  TFieldValues extends Record<string, unknown>,
> {
  getDefaultValues: () => TFieldValues;
  redirectPath: string | ((data: TFieldValues) => string);
  defaultBranch: string;
  setBranch?: (branch: string) => void;
  reset: (values: TFieldValues) => void;
  clearErrors: () => void;
  skipKeys?: string[];
  onBeforeRedirect?: (data: TFieldValues, params: URLSearchParams) => void;
  successMessage?: string | ((data: TFieldValues) => string);
  successDescription?: string | ((data: TFieldValues) => string);
  errorMessage?: string;
}

export function useFormSubmit<TFieldValues extends Record<string, unknown>>({
  getDefaultValues,
  redirectPath,
  defaultBranch,
  setBranch,
  reset,
  clearErrors,
  skipKeys = [],
  onBeforeRedirect,
  successMessage = "Laporan sedang diproses",
  successDescription,
  errorMessage = "Terjadi kesalahan saat submit",
}: UseFormSubmitOptions<TFieldValues>) {
  const router = useRouter();

  const onSubmit = useCallback(
    async (data: TFieldValues) => {
      try {
        const params = new URLSearchParams();

        Object.entries(data as Record<string, unknown>).forEach(
          ([key, value]) => {
            if (skipKeys.includes(key)) return;

            if (value === undefined || value === null || value === "") return;

            if (Array.isArray(value)) {
              value.forEach((item) => {
                if (item !== "") {
                  params.append(key, String(item));
                }
              });
              return;
            }

            params.append(key, String(value));
          },
        );

        onBeforeRedirect?.(data, params);

        const path =
          typeof redirectPath === "function"
            ? redirectPath(data)
            : redirectPath;

        await router.push(`${path}?${params.toString()}`);

        const msg =
          typeof successMessage === "function"
            ? successMessage(data)
            : successMessage;

        if (msg) {
          const desc =
            typeof successDescription === "function"
              ? successDescription(data)
              : successDescription;

          toast.success(msg, {
            duration: 2000,
            position: "top-right",
            description: desc,
            icon: "📊",
            closeButton: true,
          });
        }
      } catch (error) {
        console.error("Submit error:", error);

        toast.error(errorMessage, {
          position: "top-right",
        });
      }
    },
    [
      router,
      skipKeys,
      onBeforeRedirect,
      redirectPath,
      successMessage,
      successDescription,
      errorMessage,
    ],
  );

  const handleReset = useCallback(() => {
    reset(getDefaultValues());
    setBranch?.(defaultBranch);
    clearErrors();

    toast.success("Filter berhasil direset", {
      duration: 1500,
      position: "top-right",
    });
  }, [getDefaultValues, reset, setBranch, defaultBranch, clearErrors]);

  return { onSubmit, handleReset };
}
