// app/api/auth/forgot-password/route.ts
import { NextRequest } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import { generateOtp, hashSecret } from "@/lib/auth/twoFactor";
import { sendEmail } from "@/lib/email/sendEmail";
import { passwordResetEmailTemplate } from "@/lib/email/templates/otpEmail";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

export async function POST(request: NextRequest) {
  await connectDB();
  const body = await request.json();
  const { email } = body as { email?: string };

  if (!email) return apiError("Email zaroori hai", 400);

  // Security: hamesha same success message do (user enumeration prevent karne ke liye)
  const successMsg =
    "Agar ye email registered hai, to reset OTP bhej diya gaya hai.";

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !user.isActive) {
    return apiSuccess(null, { message: successMsg });
  }

  const otp = generateOtp();

   if (process.env.NODE_ENV !== "production") {
    console.log(`[REQUEST OTP] Email: ${user.email} | OTP: ${otp}`);
  }
  
  user.passwordResetOtpHash = await hashSecret(otp);
  user.passwordResetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  await sendEmail({
    to: user.email,
    subject: "Password Reset OTP - Gupta Studio 4u",
    html: passwordResetEmailTemplate(user.name, otp),
  });

  return apiSuccess(null, { message: successMsg });
}