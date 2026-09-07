// lib/utils/generatePassword.ts
import { customAlphabet } from "nanoid";

// Confusing characters (0/O, 1/I/l) hataye - client easily type kar sake
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const nanoid = customAlphabet(ALPHABET, 6);

/**
 * Client ke liye readable, secure password generate karta hai
 * Format: GS@X7K9P2
 */
export function generateClientPassword(): string {
  return `GS@${nanoid()}`;
}