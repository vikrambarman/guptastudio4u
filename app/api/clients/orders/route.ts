// app/api/clients/orders/route.ts
import { NextRequest } from "next/server";
import { getClientSession } from "@/lib/auth/getClientSession";
import connectDB from "@/lib/db/mongodb";
import Event from "@/lib/db/models/Event";
import Media from "@/lib/db/models/Media";
import Order from "@/lib/db/models/Order";
import { getClientOrdersList } from "@/lib/db/queries/orderQueries";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

/** Client apne selected photos/videos ka Album/Print order request bhejta hai */
export async function POST(request: NextRequest) {
  const client = await getClientSession();
  if (!client) return apiError("Unauthorized", 401);

  await connectDB();

  const body = await request.json();
  const { eventId, mediaIds, notes } = body as {
    eventId: string;
    mediaIds: string[];
    notes?: string;
  };

  if (!eventId || !Array.isArray(mediaIds) || mediaIds.length === 0) {
    return apiError(
      "eventId aur kam se kam ek media select karna zaroori hai",
      400
    );
  }

  const event = await Event.findOne({ eventId: eventId.toUpperCase() });
  if (!event) return apiError("Event not found", 404);

  if (event.clientId.toString() !== client.clientDbId) {
    return apiError("Access denied", 403);
  }

  // Security: sirf isi client + event ki media allow karo,
  // koi bhi random mediaId inject na kar sake
  const mediaDocs = await Media.find({
    mediaId: { $in: mediaIds },
    eventId: event._id,
    clientId: client.clientDbId,
  }).select("_id");

  if (mediaDocs.length === 0) {
    return apiError("Selected media invalid hai", 400);
  }

  const order = await Order.create({
    clientId: client.clientDbId,
    eventId: event._id,
    orderType: "printing",
    selectedMedia: mediaDocs.map((m) => m._id),
    status: "pending",
    notes: notes || "",
  });

  return apiSuccess(
    { orderId: order.orderId },
    { message: "Album request bhej diya gaya hai", status: 201 }
  );
}

/** Client apne saare orders (album requests) ki list dekh sakta hai */
export async function GET() {
  const client = await getClientSession();
  if (!client) return apiError("Unauthorized", 401);

  await connectDB();
  const orders = await getClientOrdersList(client.clientDbId);

  return apiSuccess(orders);
}