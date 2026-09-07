// app/api/contact/route.ts
import { NextRequest } from "next/server";
import { resend } from "@/lib/email/resend";
import { generateContactEmailHtml } from "@/lib/email/templates/contactEmail";
import { STUDIO_CONFIG } from "@/lib/config/studio";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { name, phone, email, service, message } = body;

    if (!name || !phone || !message) {
        return apiError("Name, phone aur message zaroori hain", 400);
    }

    if (!resend) {
        console.error("RESEND_API_KEY not configured - contact form email not sent");
        return apiError(
            "Email service abhi configure nahi hai. Kripya seedha call/WhatsApp karein.",
            503
        );
    }

    try {
        await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
            to: STUDIO_CONFIG.email,
            subject: `New Enquiry: ${name} (${service || "General"})`,
            html: generateContactEmailHtml({ name, phone, email, service, message }),
        });

        return apiSuccess(null, { message: "Message sent successfully" });
    } catch (error) {
        console.error("Contact email send failed:", error);
        return apiError("Message bhejne me error aayi. Please try again.", 500);
    }
}