// lib/config/upload.ts
import type { MediaType } from "@/lib/db/models/Media";

interface UploadLimit {
  maxSizeMB: number;
  mimeTypes: string[];
}

export const UPLOAD_LIMITS: Record<MediaType, UploadLimit> = {
  photo: {
    maxSizeMB: 25,
    mimeTypes: ["image/jpeg", "image/png", "image/webp"],
  },
  video: {
    maxSizeMB: 500,
    mimeTypes: ["video/mp4", "video/quicktime"],
  },
  reel: {
    maxSizeMB: 200,
    mimeTypes: ["video/mp4", "video/quicktime"],
  },
};