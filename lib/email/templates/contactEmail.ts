// lib/email/templates/contactEmail.ts
interface ContactEmailData {
  name: string;
  phone: string;
  email?: string;
  service?: string;
  message: string;
}

export function generateContactEmailHtml(data: ContactEmailData): string {
  return `
  <div style="font-family: sans-serif; background:#0a0a0a; padding:32px; color:#fff;">
    <div style="max-width:520px;margin:0 auto;background:#161616;border:1px solid #C9A84C;border-radius:12px;padding:24px;">
      <h2 style="color:#C9A84C;margin-top:0;">New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      ${data.email ? `<p><strong>Email:</strong> ${data.email}</p>` : ""}
      ${data.service ? `<p><strong>Service Interested:</strong> ${data.service}</p>` : ""}
      <p><strong>Message:</strong></p>
      <p style="background:#0a0a0a;padding:12px;border-radius:8px;">${data.message}</p>
      <hr style="border-color:#222;margin:20px 0;" />
      <p style="font-size:12px;color:#888;">Gupta Studio 4u Website Contact Form</p>
    </div>
  </div>`;
}