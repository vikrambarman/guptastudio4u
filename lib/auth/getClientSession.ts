// lib/auth/getClientSession.ts
import { cookies } from "next/headers";
import { verifyClientToken, ClientTokenPayload } from "./clientAuth";

/**
 * Server Component / API Route me current logged-in client
 * ki info nikalne ke liye
 */
export async function getClientSession(): Promise<ClientTokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("client_token")?.value;

  if (!token) {
    return null;
  }

  const payload = verifyClientToken(token);
  return payload;
}