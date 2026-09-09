// app/api/auth/request-otp/route.ts
import { NextRequest } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import { generateOtp, hashSecret } from "@/lib/auth/twoFactor";
import { signLoginToken } from "@/lib/auth/loginToken";
import { sendEmail } from "@/lib/email/sendEmail";
import { otpEmailTemplate } from "@/lib/email/templates/otpEmail";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

export async function POST(request: NextRequest) {
  await connectDB();

  const body = await request.json();
  const { email, password } = body as { email?: string; password?: string };

  if (!email || !password) {
    return apiError("Email aur password zaroori hain", 400);
  }

  const genericError = "Invalid email or password";

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );
  if (!user) return apiError(genericError, 401);

  if (!user.isActive) {
    return apiError(
      "Your account has been deactivated. Contact admin.",
      403
    );
  }

  const isValid = await user.comparePassword(password);
  if (!isValid) return apiError(genericError, 401);

  const otp = generateOtp();
  
  if (process.env.NODE_ENV !== "production") {
    console.log(`[REQUEST OTP] Email: ${user.email} | OTP: ${otp}`);
  }
  user.twoFactorOtpHash = await hashSecret(otp);
  user.twoFactorOtpExpires = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();

  await sendEmail({
    to: user.email,
    subject: "Aapka Login OTP - Gupta Studio 4u",
    html: otpEmailTemplate(user.name, otp),
  });

  const loginToken = signLoginToken(user._id.toString());

  return apiSuccess({ loginToken, email: user.email, name: user.name });
}