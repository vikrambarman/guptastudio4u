// app/api/auth/resend-otp/route.ts
import { NextRequest } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import { verifyLoginToken, signLoginToken } from "@/lib/auth/loginToken";
import { generateOtp, hashSecret } from "@/lib/auth/twoFactor";
import { sendEmail } from "@/lib/email/sendEmail";
import { otpEmailTemplate } from "@/lib/email/templates/otpEmail";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { loginToken } = body as { loginToken?: string };

  if (!loginToken) return apiError("Invalid request", 400);

  const payload = verifyLoginToken(loginToken);
  if (!payload) {
    return apiError("Login session expired. Please login again.", 401);
  }

  await connectDB();
  const user = await User.findById(payload.userId);
  if (!user || !user.isActive) return apiError("Account not found", 404);

  const otp = generateOtp();

  if (process.env.NODE_ENV !== "production") {
    console.log(`[RESEND OTP] Email: ${user.email} | OTP: ${otp}`);
  }
  user.twoFactorOtpHash = await hashSecret(otp);
  user.twoFactorOtpExpires = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();

  await sendEmail({
    to: user.email,
    subject: "Aapka Naya Login OTP - Gupta Studio 4u",
    html: otpEmailTemplate(user.name, otp),
  });

  // Fresh 5-min window ke liye naya token issue karo
  const newLoginToken = signLoginToken(user._id.toString());

  return apiSuccess({ loginToken: newLoginToken });
}