// lib/utils/crypto.ts
import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const KEY = process.env.ENCRYPTION_KEY as string;

function getKeyBuffer(): Buffer {
    if (!KEY || KEY.length !== 32) {
        throw new Error(
            "ENCRYPTION_KEY must be exactly 32 characters (check .env.local)"
        );
    }
    return Buffer.from(KEY, "utf-8");
}

/** Plain text ko encrypt karo (format: "ivHex:encryptedHex") */
export function encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, getKeyBuffer(), iv);
    const encrypted = Buffer.concat([
        cipher.update(text, "utf-8"),
        cipher.final(),
    ]);
    return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

/** Encrypted string ko wapas plain text me decrypt karo */
export function decrypt(cipherText: string): string {
    const [ivHex, encryptedHex] = cipherText.split(":");
    if (!ivHex || !encryptedHex) {
        throw new Error("Invalid encrypted string format");
    }

    const iv = Buffer.from(ivHex, "hex");
    const encrypted = Buffer.from(encryptedHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, getKeyBuffer(), iv);
    const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
    ]);
    return decrypted.toString("utf-8");
}