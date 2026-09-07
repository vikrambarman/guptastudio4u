// app/api/download/[mediaId]/route.ts
import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { getClientSession } from "@/lib/auth/getClientSession";
import connectDB from "@/lib/db/mongodb";
import Media from "@/lib/db/models/Media";
import Event from "@/lib/db/models/Event";
import { getDownloadPresignedUrl } from "@/lib/storage/presign";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

interface RouteParams {
  params: Promise<{ mediaId: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { mediaId } = await params;
  await connectDB();

  const media = await Media.findOne({ mediaId });
  if (!media) return apiError("Media not found", 404);

  // Fallback name agar originalName database me nahi hai
  const downloadFilename = media.originalName || `${mediaId}.${media.fileType === 'video' ? 'mp4' : 'jpg'}`;

  // ── Admin access: hamesha full access ──
  const adminSession = await auth();
  if (adminSession?.user) {
    // 👇 Yahan 3rd parameter 'downloadFilename' pass kiya gaya hai
    const url = await getDownloadPresignedUrl(media.r2Key, 1800, downloadFilename);
    return apiSuccess({
      url,
      mediaId: media.mediaId,
      fileType: media.fileType,
    });
  }

  // ── Client access: sirf apni khud ki media, permission check ke saath ──
  const clientSession = await getClientSession();
  if (clientSession) {
    if (clientSession.clientDbId !== media.clientId.toString()) {
      return apiError("Access denied", 403);
    }

    const event = await Event.findById(media.eventId);
    if (!event) return apiError("Event not found", 404);

    const perms = event.permissions;

    if (!perms.downloadEnabled) {
      return apiError(
        "Download abhi enable nahi hua hai. Studio se contact karein.",
        403
      );
    }

    if (perms.paymentRequired && perms.paymentStatus !== "received") {
      return apiError(
        "Payment abhi pending hai. Payment complete hone ke baad download available hoga.",
        403
      );
    }

    if (perms.expiryDate && new Date() > new Date(perms.expiryDate)) {
      return apiError("Download link expire ho chuki hai.", 403);
    }

    // 👇 Yahan 3rd parameter 'downloadFilename' pass kiya gaya hai
    const url = await getDownloadPresignedUrl(media.r2Key, 1800, downloadFilename);

    // Download count track karo
    await Media.updateOne(
      { _id: media._id },
      { $inc: { downloadCount: 1 }, $set: { lastDownloadAt: new Date() } }
    );

    return apiSuccess({
      url,
      mediaId: media.mediaId,
      fileType: media.fileType,
    });
  }

  return apiError("Unauthorized", 401);
}