// lib/auth/twoFactor.ts
import bcrypt from "bcryptjs";
import crypto from "crypto";

/** 6-digit numeric OTP generate karta hai */
export function generateOtp(): string {
    return crypto.randomInt(100000, 999999).toString();
}

/** Kisi bhi secret (OTP ya backup code) ko hash karo storage ke liye */
export async function hashSecret(value: string): Promise<string> {
    return bcrypt.hash(value, 10);
}

/** Hash ke against verify karo */
export async function compareSecret(
    value: string,
    hash: string
): Promise<boolean> {
    return bcrypt.compare(value, hash);
}

/** 10 one-time backup codes generate karta hai, format: XXXX-XXXX */
export function generateBackupCodes(count = 10): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
        const raw = crypto.randomBytes(4).toString("hex").toUpperCase();
        codes.push(`${raw.slice(0, 4)}-${raw.slice(4, 8)}`);
    }
    return codes;
}

/**
 * Hashed backup codes ki list me se candidate match karta hai.
 * Match milne par uska index return karta hai (taaki use hone ke
 * baad wo specific code array se remove kiya ja sake - one-time use).
 * Match na mile to -1.
 */
export async function findMatchingBackupCode(
    hashedCodes: string[],
    candidate: string
): Promise<number> {
    const normalized = candidate.trim().toUpperCase();
    for (let i = 0; i < hashedCodes.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        if (await compareSecret(normalized, hashedCodes[i])) {
            return i;
        }
    }
    return -1;
}