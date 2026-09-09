// app/api/clients/media/[mediaId]/original/route.ts
import { NextRequest } from "next/server";
import { getClientSession } from "@/lib/auth/getClientSession";
import connectDB from "@/lib/db/mongodb";
import Media from "@/lib/db/models/Media";
import { getDownloadPresignedUrl } from "@/lib/storage/presign";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

interface RouteParams {
  params: Promise<{ mediaId: string }>;
}

/**
 * Client ko photo ki ORIGINAL quality dikhane ke liye (thumbnail nahi).
 * Ye sirf "album select karne ke liye dekhna" hai — actual permanent
 * download nahi. Isliye downloadEnabled/payment permission check
 * yaha JAAN-BOOJH KAR nahi hai (sirf ownership check hai).
 *
 * Real file download hamesha /api/download/[mediaId] route se hi
 * hoga, jo payment/permission fully enforce karta hai.
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const client = await getClientSession();
  if (!client) return apiError("Unauthorized", 401);

  const { mediaId } = await params;
  await connectDB();

  const media = await Media.findOne({ mediaId });
  if (!media) return apiError("Media not found", 404);

  if (media.clientId.toString() !== client.clientDbId) {
    return apiError("Access denied", 403);
  }

  if (media.fileType !== "photo") {
    return apiError("Sirf photos ka original view available hai", 400);
  }

  const url = await getDownloadPresignedUrl(media.r2Key, 900); // 15 min validity

  return apiSuccess({ url });
}