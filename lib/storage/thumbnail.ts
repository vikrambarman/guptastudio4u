// lib/storage/thumbnail.ts
import sharp from "sharp";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client, R2_BUCKET } from "./r2";
import type { Readable } from "stream";

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

interface ThumbnailResult {
  width?: number;
  height?: number;
}

export async function generatePhotoThumbnail(
  originalKey: string,
  thumbnailKey: string
): Promise<ThumbnailResult> {
  const getCommand = new GetObjectCommand({
    Bucket: R2_BUCKET,
    Key: originalKey,
  });
  const response = await r2Client.send(getCommand);
  const buffer = await streamToBuffer(response.Body as Readable);

  const thumbnailBuffer = await sharp(buffer)
    .resize(500, 500, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer();

  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: thumbnailKey,
      Body: thumbnailBuffer,
      ContentType: "image/jpeg",
    })
  );

  const metadata = await sharp(buffer).metadata();
  return { width: metadata.width, height: metadata.height };
}