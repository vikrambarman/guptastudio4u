// app/api/events/[eventId]/media/route.ts
import { NextRequest } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Event from "@/lib/db/models/Event";
import Media from "@/lib/db/models/Media";
import { getEventMediaWithUrls } from "@/lib/db/queries/mediaQueries";
import { deleteR2Object } from "@/lib/storage/presign";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

interface RouteParams {
  params: Promise<{ eventId: string }>;
}

// GET /api/events/[eventId]/media - List all media (with signed preview URLs)
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user) return apiError("Unauthorized", 401);

  const { eventId } = await params;
  await connectDB();

  const event = await Event.findOne({ eventId: eventId.toUpperCase() });
  if (!event) return apiError("Event not found", 404);

  const media = await getEventMediaWithUrls(event._id.toString());
  return apiSuccess(media);
}

// DELETE /api/events/[eventId]/media?mediaId=MEDIA-2024-000001
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user) return apiError("Unauthorized", 401);

  const { eventId } = await params;
  const { searchParams } = new URL(request.url);
  const mediaId = searchParams.get("mediaId");

  if (!mediaId) return apiError("mediaId query param zaroori hai", 400);

  await connectDB();

  const event = await Event.findOne({ eventId: eventId.toUpperCase() });
  if (!event) return apiError("Event not found", 404);

  const media = await Media.findOne({ mediaId, eventId: event._id });
  if (!media) return apiError("Media not found", 404);

  // R2 se dono files delete karo (original + thumbnail agar hai)
  await deleteR2Object(media.r2Key);
  if (media.thumbnailKey) {
    await deleteR2Object(media.thumbnailKey);
  }

  const decField =
    media.fileType === "photo"
      ? "totalPhotos"
      : media.fileType === "video"
        ? "totalVideos"
        : "totalReels";

  await Event.updateOne({ _id: event._id }, { $inc: { [decField]: -1 } });
  await media.deleteOne();

  return apiSuccess(null, { message: "Media deleted successfully" });
}


// PATCH /api/events/[eventId]/media - Toggle isPublic (Public Gallery ke liye)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user) return apiError("Unauthorized", 401);

  const { eventId } = await params;
  await connectDB();

  const { mediaId, isPublic } = await request.json();
  if (!mediaId || typeof isPublic !== "boolean") {
    return apiError("mediaId aur isPublic (boolean) zaroori hain", 400);
  }

  const event = await Event.findOne({ eventId: eventId.toUpperCase() });
  if (!event) return apiError("Event not found", 404);

  const media = await Media.findOneAndUpdate(
    { mediaId, eventId: event._id },
    { $set: { isPublic } },
    { new: true }
  );

  if (!media) return apiError("Media not found", 404);

  return apiSuccess(
    { mediaId: media.mediaId, isPublic: media.isPublic },
    { message: isPublic ? "Public Gallery me add ho gaya" : "Public Gallery se hata diya" }
  );
}