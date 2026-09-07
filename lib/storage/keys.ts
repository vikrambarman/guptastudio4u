// lib/storage/keys.ts
import { nanoid } from "nanoid";
import type { MediaType } from "@/lib/db/models/Media";

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * R2 key generate karta hai. Photo ke liye original/thumbnail dono
 * subfolders support karta hai. Video/Reel abhi single folder me
 * (thumbnail generation future scope hai - Part D me flag kiya hai).
 */
export function generateR2Key(
  eventId: string,
  fileType: MediaType,
  originalName: string,
  variant: "original" | "thumbnail" = "original"
): string {
  const safeName = sanitizeFileName(originalName);
  const unique = nanoid(8);

  if (fileType === "photo") {
    const sub = variant === "thumbnail" ? "thumbnails" : "original";
    return `events/${eventId}/photos/${sub}/${unique}-${safeName}`;
  }

  const folder = fileType === "video" ? "videos" : "reels";
  return `events/${eventId}/${folder}/${unique}-${safeName}`;
}