// src/lib/apiHandler.ts
import { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse } from "@/types/api";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export function checkMethod(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<unknown>>,
  allowed: HttpMethod | HttpMethod[] = "GET",
): boolean {
  const allowedMethods = Array.isArray(allowed) ? allowed : [allowed];

  if (!allowedMethods.includes(req.method as HttpMethod)) {
    res.status(405).json({
      success: false,
      message: `Method '${req.method}' not allowed. Use ${allowedMethods.join(", ")}.`,
    });
    return false;
  }
  return true;
}

export function handleServerError(
  res: NextApiResponse<ApiResponse<unknown>>,
  error: unknown,
  branch: string,
  label: string,
) {
  const isDatabaseError =
    error instanceof Error && error.message.includes("connect");

  console.error(
    `[${label}] ${isDatabaseError ? "DB" : "Server"} Error:`,
    error,
  );

  return res.status(500).json({
    success: false,
    message: isDatabaseError
      ? `Gagal terhubung ke database branch '${branch}'. Periksa koneksi.`
      : "Terjadi kesalahan pada server. Silakan coba beberapa saat lagi.",
    errors: error instanceof Error ? error.message : String(error),
  });
}
