// app/api/clients/[clientId]/credentials/route.ts
import { NextRequest } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Client from "@/lib/db/models/Client";
import { generateClientPassword } from "@/lib/utils/generatePassword";
import { encrypt, decrypt } from "@/lib/utils/crypto";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

interface RouteParams {
    params: Promise<{ clientId: string }>;
}

// GET - Current password reveal karo (decrypt)
export async function GET(_request: NextRequest, { params }: RouteParams) {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const { clientId } = await params;
    await connectDB();

    const client = await Client.findOne({
        clientId: clientId.toUpperCase(),
    }).select("+plainPassword clientId name phone");

    if (!client) return apiError("Client not found", 404);

    try {
        const password = decrypt(client.plainPassword);
        return apiSuccess({
            clientId: client.clientId,
            name: client.name,
            phone: client.phone,
            password,
        });
    } catch {
        return apiError(
            "Could not decrypt password. Please reset it instead.",
            500
        );
    }
}

// POST - Naya password generate karo (reset)
export async function POST(_request: NextRequest, { params }: RouteParams) {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const { clientId } = await params;
    await connectDB();

    const client = await Client.findOne({ clientId: clientId.toUpperCase() });
    if (!client) return apiError("Client not found", 404);

    const newPassword = generateClientPassword();
    client.password = newPassword; // pre-save hook hash karega
    client.plainPassword = encrypt(newPassword);
    await client.save();

    return apiSuccess(
        { clientId: client.clientId, password: newPassword },
        { message: "Password reset successfully" }
    );
}