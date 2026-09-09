// lib/db/queries/mediaQueries.ts
import Media from "@/lib/db/models/Media";
import { getDownloadPresignedUrl } from "@/lib/storage/presign";

/**
 * Event ki saari media list karo, photos ke liye thumbnail ka
 * presigned URL bhi attach karo (grid me dikhane ke liye).
 * Videos/reels ke liye previewUrl null rahega - wo lazy-load
 * honge (bandwidth bachane ke liye) jab admin explicitly click kare.
 */
export async function getEventMediaWithUrls(eventDbId: string) {
    const mediaList = await Media.find({ eventId: eventDbId })
        .sort({ createdAt: -1 })
        .lean();

    const withUrls = await Promise.all(
        mediaList.map(async (media) => {
            let previewUrl: string | null = null;

            if (media.fileType === "photo") {
                const key = media.thumbnailKey || media.r2Key;
                previewUrl = await getDownloadPresignedUrl(key, 1800); // 30 min
            }

            return { ...media, previewUrl };
        })
    );

    return withUrls;
}


/**
 * Admin Gallery page ke liye — saari public-marked photos,
 * kisi bhi event ki ho, ek jagah list karta hai.
 */
export async function getAllPublicMedia(limit = 100) {
  const mediaList = await Media.find({ isPublic: true })
    .populate("eventId", "eventId title")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  const withUrls = await Promise.all(
    mediaList.map(async (media) => {
      const key = media.thumbnailKey || media.r2Key;
      const previewUrl = await getDownloadPresignedUrl(key, 1800);
      const event = media.eventId as unknown as {
        eventId?: string;
        title?: string;
      } | null;

      return {
        _id: media._id.toString(),
        mediaId: media.mediaId,
        originalName: media.originalName,
        fileType: media.fileType,
        isPublic: media.isPublic,
        previewUrl,
        eventCode: event?.eventId || "",
        eventTitle: event?.title || "",
      };
    })
  );

  return withUrls;
}

/**
 * Ek particular event ki media dhoondhta hai bina URL-generate kiye
 * (Gallery page me "toggle public" ke baad refresh ke liye helper).
 * Already getEventMediaWithUrls hai upar — is naye function ki
 * zaroorat sirf gallery-wide listing ke liye thi (upar wala function).
 */