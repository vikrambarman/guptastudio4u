// lib/utils/apiResponse.ts
import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types";

interface SuccessOptions<T> {
  message?: string;
  status?: number;
  pagination?: ApiResponse<T>["pagination"];
}

export function apiSuccess<T>(data: T, options: SuccessOptions<T> = {}) {
  const { message, status = 200, pagination } = options;
  return NextResponse.json<ApiResponse<T>>(
    { success: true, data, message, pagination },
    { status }
  );
}

export function apiError(error: string, status = 400) {
  return NextResponse.json<ApiResponse<never>>(
    { success: false, error },
    { status }
  );
}