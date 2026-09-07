// app/api/auth/client-logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("client_token");

  return NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });
}