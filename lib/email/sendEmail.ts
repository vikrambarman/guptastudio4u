// lib/email/sendEmail.ts
import { resend } from "./resend";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

const FROM_ADDRESS =
  process.env.RESEND_FROM_EMAIL || "Gupta Studio 4u <onboarding@resend.dev>";

/**
 * Common email sender. Agar Resend configure nahi hai (dev mode),
 * to email send nahi hoga - sirf console me OTP log hoga, taaki
 * local development bina live email ke bhi test ho sake.
 */
export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  if (!resend) {
    console.log(`[DEV MODE - Email skip] To: ${to} | Subject: ${subject}`);
    return { sent: false };
  }

  try {
    await resend.emails.send({ from: FROM_ADDRESS, to, subject, html });
    return { sent: true };
  } catch (err) {
    console.error("Email send failed:", err);
    return { sent: false, error: err };
  }
}