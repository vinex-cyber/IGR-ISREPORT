// src/types/api.ts
export type ApiSuccess<T> = {
  success: true;
  message: string;
  total: number;
  data: T;
};

export type ApiError = {
  success: false;
  message: string;
  errors?: unknown;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
