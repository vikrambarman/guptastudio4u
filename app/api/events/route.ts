// app/api/events/route.ts
import { NextRequest } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Event from "@/lib/db/models/Event";
import Client from "@/lib/db/models/Client";
import { getEventsList } from "@/lib/db/queries/eventQueries";
import { STUDIO_CONFIG } from "@/lib/config/studio";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

// GET /api/events?search=&status=&clientDbId=&page=
export async function GET(request: NextRequest) {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const { events, total, totalPages } = await getEventsList({
        search: searchParams.get("search") || "",
        status: searchParams.get("status") || "",
        clientDbId: searchParams.get("clientDbId") || "",
        page,
        limit,
    });

    return apiSuccess(events, {
        pagination: { total, page, limit, totalPages },
    });
}

// POST /api/events - Create new event
export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    await connectDB();

    const body = await request.json();
    const {
        clientId, // "GS4U-2024-001" - client ka public code, DB _id nahi
        title,
        eventType,
        eventDate,
        venue,
        description,
        packageName,
        packagePrice,
        packageIncludes, // comma separated string se aayega
    } = body;

    if (!clientId || !title || !eventType || !eventDate || !venue) {
        return apiError(
            "Client, title, event type, date aur venue required hain",
            400
        );
    }

    const client = await Client.findOne({ clientId: clientId.toUpperCase() });
    if (!client) return apiError("Client not found", 404);

    const event = await Event.create({
        title,
        eventType,
        clientId: client._id,
        eventDate: new Date(eventDate),
        venue,
        description: description || "",
        qrCode: STUDIO_CONFIG.qrScanUrl, // ✅ Universal - har event me same value
        createdBy: session.user.id,
        ...(packageName
            ? {
                packageDetails: {
                    name: packageName,
                    price: Number(packagePrice) || 0,
                    includes: packageIncludes
                        ? String(packageIncludes)
                            .split(",")
                            .map((s: string) => s.trim())
                            .filter(Boolean)
                        : [],
                },
            }
            : {}),
    });

    // Client ke events array me bhi link karo
    await Client.updateOne(
        { _id: client._id },
        { $push: { events: event._id } }
    );

    return apiSuccess(
        { eventId: event.eventId, title: event.title },
        { message: "Event created successfully", status: 201 }
    );
}