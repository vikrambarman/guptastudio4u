// app/api/public/gallery/route.ts
import { NextRequest } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { getPublicGalleryMedia } from "@/lib/db/queries/publicQueries";
import { apiSuccess } from "@/lib/utils/apiResponse";

/** Public website ki Gallery page ke liye — auth ki zaroorat nahi */
export async function GET(request: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "60", 10);

  const media = await getPublicGalleryMedia(limit);

  return apiSuccess(media);
}