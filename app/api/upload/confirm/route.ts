// app/api/upload/confirm/route.ts
import { NextRequest } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Event from "@/lib/db/models/Event";
import Media from "@/lib/db/models/Media";
import { generateR2Key } from "@/lib/storage/keys";
import { generatePhotoThumbnail } from "@/lib/storage/thumbnail";
import { R2_BUCKET } from "@/lib/storage/r2";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";
import type { MediaType } from "@/lib/db/models/Media";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return apiError("Unauthorized", 401);

  await connectDB();

  const body = await request.json();
  const {
    eventId,
    r2Key,
    fileName,
    originalName,
    fileType,
    mimeType,
    fileSize,
    duration,
  } = body as {
    eventId: string;
    r2Key: string;
    fileName: string;
    originalName?: string;
    fileType: MediaType;
    mimeType: string;
    fileSize: number;
    duration?: number;
  };

  if (!eventId || !r2Key || !fileType || !mimeType || !fileSize) {
    return apiError("Missing required fields", 400);
  }

  const event = await Event.findOne({ eventId: eventId.toUpperCase() });
  if (!event) return apiError("Event not found", 404);

  let thumbnailKey: string | undefined;
  let width: number | undefined;
  let height: number | undefined;

  if (fileType === "photo") {
    thumbnailKey = generateR2Key(event.eventId, "photo", fileName, "thumbnail");
    try {
      const dims = await generatePhotoThumbnail(r2Key, thumbnailKey);
      width = dims.width;
      height = dims.height;
    } catch (err) {
      console.error("Thumbnail generation failed:", err);
      thumbnailKey = undefined; // Media phir bhi save hoga, thumbnail ke bina
    }
  }

  const media = await Media.create({
    eventId: event._id,
    clientId: event.clientId,
    fileName,
    originalName: originalName || fileName,
    fileType,
    mimeType,
    fileSize,
    r2Key,
    r2Bucket: R2_BUCKET,
    thumbnailKey,
    width,
    height,
    duration,
    uploadedBy: session.user.id,
  });

  const incField =
    fileType === "photo"
      ? "totalPhotos"
      : fileType === "video"
        ? "totalVideos"
        : "totalReels";

  await Event.updateOne({ _id: event._id }, { $inc: { [incField]: 1 } });

  return apiSuccess(
    { mediaId: media.mediaId, thumbnailKey },
    { message: "Media uploaded successfully", status: 201 }
  );
}