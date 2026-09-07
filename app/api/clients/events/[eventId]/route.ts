// app/api/client/events/[eventId]/route.ts
import { NextRequest } from "next/server";
import { getClientSession } from "@/lib/auth/getClientSession";
import connectDB from "@/lib/db/mongodb";
import { getEventDetail } from "@/lib/db/queries/eventQueries";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

interface RouteParams {
  params: Promise<{ eventId: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const client = await getClientSession();
  if (!client) return apiError("Unauthorized", 401);

  const { eventId } = await params;
  await connectDB();

  const event = await getEventDetail(eventId);
  if (!event) return apiError("Event not found", 404);

  if (event.clientId !== client.clientDbId) {
    return apiError("Access denied", 403);
  }

  return apiSuccess(event);
}