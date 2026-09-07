// lib/email/resend.ts
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

// Defensive: agar API key set nahi hai to null rahega,
// app crash nahi hogi - contact form graceful error dega
export const resend = apiKey ? new Resend(apiKey) : null;