// app/api/clients/route.ts
import { NextRequest } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Client from "@/lib/db/models/Client";
import { getClientsList } from "@/lib/db/queries/clientQueries";
import { generateClientPassword } from "@/lib/utils/generatePassword";
import { encrypt } from "@/lib/utils/crypto";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

// GET /api/clients?search=&page=&limit=
export async function GET(request: NextRequest) {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const search = searchParams.get("search") || "";

    const { clients, total, totalPages } = await getClientsList({
        search,
        page,
        limit,
    });

    return apiSuccess(clients, {
        pagination: { total, page, limit, totalPages },
    });
}

// POST /api/clients - Register new client
export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    await connectDB();

    const body = await request.json();
    const { name, phone, email, address } = body;

    if (!name || !phone) {
        return apiError("Name and phone are required", 400);
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        return apiError("Enter a valid 10-digit phone number", 400);
    }

    const plainPassword = generateClientPassword();

    const client = await Client.create({
        name,
        phone,
        email: email || "",
        address: address || "",
        password: plainPassword, // pre-save hook hash karega
        plainPassword: encrypt(plainPassword), // encrypted at rest
        createdBy: session.user.id,
    });

    return apiSuccess(
        {
            clientId: client.clientId,
            name: client.name,
            phone: client.phone,
            password: plainPassword, // ✅ Sirf ISI response me raw password milega
        },
        { message: "Client registered successfully", status: 201 }
    );
}