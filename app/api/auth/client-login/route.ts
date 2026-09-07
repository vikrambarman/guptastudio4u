// app/api/auth/client-login/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Client from "@/lib/db/models/Client";
import { generateClientToken } from "@/lib/auth/clientAuth";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { clientId, password } = await request.json();

    if (!clientId || !password) {
      return NextResponse.json(
        { success: false, error: "Client ID and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Client ID case-insensitive search
    const client = await Client.findOne({
      clientId: clientId.trim().toUpperCase(),
    }).select("+password");

    if (!client) {
      return NextResponse.json(
        { success: false, error: "Invalid Client ID or Password" },
        { status: 401 }
      );
    }

    if (!client.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: "Your account has been deactivated. Contact studio.",
        },
        { status: 403 }
      );
    }

    const isPasswordValid = await client.comparePassword(password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Invalid Client ID or Password" },
        { status: 401 }
      );
    }

    // JWT Token generate karo
    const token = generateClientToken({
      clientDbId: client._id.toString(),
      clientId: client.clientId,
      name: client.name,
      phone: client.phone,
    });

    // HttpOnly cookie me token store karo (secure)
    const cookieStore = await cookies();
    cookieStore.set("client_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Login successful",
      data: {
        clientId: client.clientId,
        name: client.name,
        phone: client.phone,
      },
    });
  } catch (error) {
    console.error("Client login error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}