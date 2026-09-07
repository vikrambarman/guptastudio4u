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