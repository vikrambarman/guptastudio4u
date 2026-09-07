// lib/db/queries/publicQueries.ts
import Media from "@/lib/db/models/Media";
import { getDownloadPresignedUrl } from "@/lib/storage/presign";

export interface PublicGalleryItem {
  mediaId: string;
  url: string;
}

/**
 * Sirf explicitly "isPublic" mark ki hui photos return karta hai.
 * Admin MediaGrid me toggle se ye flag set hota hai (Step 11 addition).
 */
export async function getPublicGalleryMedia(
  limit = 60
): Promise<PublicGalleryItem[]> {
  const mediaList = await Media.find({ isPublic: true, fileType: "photo" })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  const withUrls = await Promise.all(
    mediaList.map(async (media) => ({
      mediaId: media.mediaId,
      url: await getDownloadPresignedUrl(media.thumbnailKey || media.r2Key, 3600),
    }))
  );

  return withUrls;
}