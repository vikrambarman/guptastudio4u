// app/api/events/[eventId]/route.ts
import { NextRequest } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Event from "@/lib/db/models/Event";
import { getEventDetail } from "@/lib/db/queries/eventQueries";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

interface RouteParams {
    params: Promise<{ eventId: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const { eventId } = await params;
    await connectDB();

    const event = await getEventDetail(eventId);
    if (!event) return apiError("Event not found", 404);

    return apiSuccess(event);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const { eventId } = await params;
    await connectDB();

    const body = await request.json();
    const { status, title, eventDate, venue, description } = body;

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) updateData.status = status;
    if (title !== undefined) updateData.title = title;
    if (eventDate !== undefined) updateData.eventDate = new Date(eventDate);
    if (venue !== undefined) updateData.venue = venue;
    if (description !== undefined) updateData.description = description;

    const event = await Event.findOneAndUpdate(
        { eventId: eventId.toUpperCase() },
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!event) return apiError("Event not found", 404);

    return apiSuccess(
        { eventId: event.eventId, status: event.status },
        { message: "Event updated successfully" }
    );
}