// lib/auth/clientAuth.ts
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const TOKEN_EXPIRY = "7d"; // 7 days

export interface ClientTokenPayload {
  clientDbId: string;   // MongoDB _id
  clientId: string;     // GS4U-2024-001
  name: string;
  phone: string;
}

/**
 * Client ke liye JWT token generate karo (login success ke baad)
 */
export function generateClientToken(payload: ClientTokenPayload): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
}

/**
 * Client JWT token verify karo
 */
export function verifyClientToken(
  token: string
): ClientTokenPayload | null {
  try {
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const decoded = jwt.verify(token, JWT_SECRET) as ClientTokenPayload;
    return decoded;
  } catch (error) {
    console.error("Client token verification failed:", error);
    return null;
  }
}