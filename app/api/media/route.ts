// app/api/media/route.ts
import { NextRequest } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import { getAllPublicMedia } from "@/lib/db/queries/mediaQueries";
import Media from "@/lib/db/models/Media";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

/** Admin Gallery page ke liye — saari public media (cross-event) */
export async function GET() {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    await connectDB();
    const media = await getAllPublicMedia();

    return apiSuccess(media);
}

/** Gallery page se directly public/private toggle karne ke liye */
export async function PATCH(request: NextRequest) {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    await connectDB();

    const body = await request.json();
    const { mediaId, isPublic } = body as { mediaId: string; isPublic: boolean };

    if (!mediaId || isPublic === undefined) {
        return apiError("mediaId aur isPublic zaroori hain", 400);
    }

    const media = await Media.findOneAndUpdate(
        { mediaId },
        { isPublic },
        { new: true }
    );

    if (!media) return apiError("Media not found", 404);

    return apiSuccess(media, { message: "Media updated successfully" });
}