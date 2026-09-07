// app/api/clients/[clientId]/route.ts
import { NextRequest } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Client from "@/lib/db/models/Client";
import Event from "@/lib/db/models/Event";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

interface RouteParams {
    params: Promise<{ clientId: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const { clientId } = await params;
    await connectDB();

    const client = await Client.findOne({ clientId: clientId.toUpperCase() })
        .select("-password -plainPassword")
        .lean();

    if (!client) return apiError("Client not found", 404);

    const events = await Event.find({ clientId: client._id })
        .sort({ eventDate: -1 })
        .lean();

    return apiSuccess({ client, events });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const { clientId } = await params;
    await connectDB();

    const body = await request.json();
    const { name, phone, email, address, isActive } = body;

    if (phone && !/^[0-9]{10}$/.test(phone)) {
        return apiError("Enter a valid 10-digit phone number", 400);
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (address !== undefined) updateData.address = address;
    if (isActive !== undefined) updateData.isActive = isActive;

    const client = await Client.findOneAndUpdate(
        { clientId: clientId.toUpperCase() },
        { $set: updateData },
        { new: true, runValidators: true }
    ).select("-password -plainPassword");

    if (!client) return apiError("Client not found", 404);

    return apiSuccess(client, { message: "Client updated successfully" });
}