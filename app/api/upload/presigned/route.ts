// app/api/upload/presigned/route.ts
import { NextRequest } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Event from "@/lib/db/models/Event";
import { generateR2Key } from "@/lib/storage/keys";
import { getUploadPresignedUrl } from "@/lib/storage/presign";
import { R2_BUCKET } from "@/lib/storage/r2";
import { UPLOAD_LIMITS } from "@/lib/config/upload";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";
import type { MediaType } from "@/lib/db/models/Media";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return apiError("Unauthorized", 401);

  await connectDB();

  const body = await request.json();
  const { eventId, fileName, fileType, mimeType, fileSize } = body as {
    eventId: string;
    fileName: string;
    fileType: MediaType;
    mimeType: string;
    fileSize: number;
  };

  if (!eventId || !fileName || !fileType || !mimeType || !fileSize) {
    return apiError(
      "eventId, fileName, fileType, mimeType aur fileSize zaroori hain",
      400
    );
  }

  const event = await Event.findOne({ eventId: eventId.toUpperCase() });
  if (!event) return apiError("Event not found", 404);

  const limits = UPLOAD_LIMITS[fileType];
  if (!limits) return apiError("Invalid file type", 400);

  const maxBytes = limits.maxSizeMB * 1024 * 1024;
  if (fileSize > maxBytes) {
    return apiError(`File size ${limits.maxSizeMB}MB se zyada nahi ho sakta`, 400);
  }
  if (!limits.mimeTypes.includes(mimeType)) {
    return apiError(`${fileType} ke liye "${mimeType}" allowed nahi hai`, 400);
  }

  const r2Key = generateR2Key(event.eventId, fileType, fileName, "original");
  const uploadUrl = await getUploadPresignedUrl(r2Key, mimeType);

  return apiSuccess({ uploadUrl, r2Key, r2Bucket: R2_BUCKET });
}