// app/api/orders/route.ts
import { NextRequest } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import { getOrdersList } from "@/lib/db/queries/orderQueries";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return apiError("Unauthorized", 401);

  await connectDB();

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const result = await getOrdersList({ search, status, page });

  return apiSuccess(result.orders, {
    pagination: {
      total: result.total,
      page,
      limit: 20,
      totalPages: result.totalPages,
    },
  });
}