// app/api/client/events/route.ts
import { NextRequest } from "next/server";
import { getClientSession } from "@/lib/auth/getClientSession";
import connectDB from "@/lib/db/mongodb";
import { getEventsList } from "@/lib/db/queries/eventQueries";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

export async function GET(_request: NextRequest) {
  const client = await getClientSession();
  if (!client) return apiError("Unauthorized", 401);

  await connectDB();
  const { events } = await getEventsList({
    clientDbId: client.clientDbId,
    limit: 100,
  });

  return apiSuccess(events);
}