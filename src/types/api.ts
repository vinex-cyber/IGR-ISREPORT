// src/types/api.ts

export type ApiSuccess<T> = {
  success: true;
  message: string;

  total: number;

  page?: number;
  limit?: number;
  totalPages?: number;

  data: T;

  totals?: Record<string, unknown> | null;
};

export type ApiError = {
  success: false;
  message: string;
  errors?: unknown;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
