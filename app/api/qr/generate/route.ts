// app/api/qr/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json(
            { success: false, error: "Unauthorized" },
            { status: 401 }
        );
    }

    const { searchParams } = new URL(request.url);
    const value = searchParams.get("value");
    const size = parseInt(searchParams.get("size") || "400", 10);

    if (!value) {
        return NextResponse.json(
            { success: false, error: "value query param zaroori hai" },
            { status: 400 }
        );
    }

    const buffer = await QRCode.toBuffer(value, {
        width: size,
        margin: 2,
        color: { dark: "#0a0a0a", light: "#ffffff" },
        errorCorrectionLevel: "H",
    });

    return new NextResponse(new Uint8Array(buffer), {
        headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=86400",
        },
    });
}