// lib/email/templates/otpEmail.ts
export function otpEmailTemplate(name: string, otp: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background:#0a0a0a; color:#fff; padding: 32px; border-radius: 12px; border: 1px solid #C9A84C;">
      <h2 style="color:#C9A84C; margin-bottom: 16px;">Gupta Studio 4u — Login Verification</h2>
      <p>Namaste ${name},</p>
      <p>Aapka login OTP hai:</p>
      <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #F0C040; margin: 24px 0; text-align:center; background: #161616; padding: 16px; border-radius: 8px;">${otp}</div>
      <p style="font-size: 14px; color: #ccc;">Ye OTP <strong>5 minute</strong> me expire ho jayega. Agar aapne login attempt nahi kiya hai, to is email ko ignore karein.</p>
      <p style="color:#888; font-size:12px; margin-top:24px;">— Gupta Studio 4u Security Team</p>
    </div>
  `;
}

export function passwordResetEmailTemplate(name: string, otp: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background:#0a0a0a; color:#fff; padding: 32px; border-radius: 12px; border: 1px solid #C9A84C;">
      <h2 style="color:#C9A84C; margin-bottom: 16px;">Password Reset Request</h2>
      <p>Namaste ${name},</p>
      <p>Aapka password reset OTP hai:</p>
      <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #F0C040; margin: 24px 0; text-align:center; background: #161616; padding: 16px; border-radius: 8px;">${otp}</div>
      <p style="font-size: 14px; color: #ccc;">Ye OTP <strong>10 minute</strong> me expire ho jayega. Agar aapne ye request nahi ki hai, to is email ko ignore karein — aapka password safe hai.</p>
      <p style="color:#888; font-size:12px; margin-top:24px;">— Gupta Studio 4u Security Team</p>
    </div>
  `;
}