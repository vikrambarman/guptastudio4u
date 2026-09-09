// lib/storage/presign.ts
import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client, R2_BUCKET } from "./r2";

/**
 * Browser directly is URL pe file PUT karega (server bandwidth nahi use hoga)
 *
 * ⚠️ Important: ContentType YAHA signing me pass NAHI karte (intentional).
 * Agar ContentType command me set karte, to wo signature ka mandatory
 * "signed header" ban jaata — browser ko PUT ke waqt EXACT same
 * Content-Type header bhejna padta, warna "SignatureDoesNotMatch" (403)
 * milta (jo browser me galat tarike se CORS error jaisa dikhta hai).
 *
 * Client-side (MediaUploader.tsx) phir bhi Content-Type header PUT
 * request ke saath bhejta hai — R2 use bina kisi signature check ke
 * object ka content-type metadata bana kar store kar lega. Isse
 * correct MIME type bhi save hota hai aur mismatch bug bhi nahi aata.
 */
export async function getUploadPresignedUrl(
  key: string,
  _contentType: string, // signature me ab use nahi hota, sirf API consistency ke liye param rakha hai
  expiresIn = 3600
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
  });
  return getSignedUrl(r2Client, command, { expiresIn });
}

/**
 * Private file view/download karne ke liye temporary signed URL.
 *
 * `downloadFilename` optional hai — pass karne par R2 ko
 * ResponseContentDisposition header bhejne ko bola jaata hai,
 * jisse browser file save karte waqt original naam use karta hai
 * (na ki r2Key wala random UUID naam).
 */
export async function getDownloadPresignedUrl(
  key: string,
  expiresIn = 3600,
  downloadFilename?: string
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ...(downloadFilename
      ? {
        ResponseContentDisposition: `attachment; filename="${downloadFilename.replace(
          /"/g,
          ""
        )}"`,
      }
      : {}),
  });
  return getSignedUrl(r2Client, command, { expiresIn });
}

/** R2 se file permanently delete karo (original ya thumbnail) */
export async function deleteR2Object(key: string): Promise<void> {
  await r2Client.send(
    new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key })
  );
}