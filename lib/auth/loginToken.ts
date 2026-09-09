// lib/auth/loginToken.ts
import jwt from "jsonwebtoken";

interface LoginTokenPayload {
  userId: string;
  purpose: "2fa-login";
}

// AUTH_SECRET NextAuth v5 ke liye already mandatory hai, isliye
// isi ko reuse kar rahe hain - koi naya env var nahi chahiye
const SECRET = process.env.AUTH_SECRET as string;

/** Password verify hone ke baad, OTP step ke liye temporary token (5 min) */
export function signLoginToken(userId: string): string {
  return jwt.sign({ userId, purpose: "2fa-login" }, SECRET, {
    expiresIn: "5m",
  });
}

export function verifyLoginToken(token: string): LoginTokenPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET) as LoginTokenPayload;
    if (decoded.purpose !== "2fa-login") return null;
    return decoded;
  } catch {
    return null;
  }
}