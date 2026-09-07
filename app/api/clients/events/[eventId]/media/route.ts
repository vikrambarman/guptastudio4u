// app/api/clients/events/[eventId]/media/route.ts
import { NextRequest } from "next/server";
import { getClientSession } from "@/lib/auth/getClientSession";
import connectDB from "@/lib/db/mongodb";
import Event from "@/lib/db/models/Event";
import { getEventMediaWithUrls } from "@/lib/db/queries/mediaQueries";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

interface RouteParams {
  params: Promise<{ eventId: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const client = await getClientSession();
  if (!client) return apiError("Unauthorized", 401);

  const { eventId } = await params;
  await connectDB();

  const event = await Event.findOne({ eventId: eventId.toUpperCase() });
  if (!event) return apiError("Event not found", 404);

  if (event.clientId.toString() !== client.clientDbId) {
    return apiError("Access denied", 403);
  }

  // Thumbnails hamesha visible hain (selection ke liye) - full download
  // alag se /api/download/[mediaId] permission-gated route se hoga
  const media = await getEventMediaWithUrls(event._id.toString());
  return apiSuccess(media);
}