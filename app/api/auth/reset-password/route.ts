// app/api/auth/reset-password/route.ts
import { NextRequest } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import { compareSecret } from "@/lib/auth/twoFactor";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

export async function POST(request: NextRequest) {
  await connectDB();
  const body = await request.json();
  const { email, otp, newPassword } = body as {
    email?: string;
    otp?: string;
    newPassword?: string;
  };

  if (!email || !otp || !newPassword) {
    return apiError("Email, OTP aur naya password zaroori hain", 400);
  }
  if (newPassword.length < 6) {
    return apiError("Password kam se kam 6 characters ka hona chahiye", 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+passwordResetOtpHash +passwordResetOtpExpires"
  );

  if (!user || !user.passwordResetOtpHash || !user.passwordResetOtpExpires) {
    return apiError("Invalid ya expired reset request", 400);
  }
  if (new Date() > user.passwordResetOtpExpires) {
    return apiError("OTP expire ho chuka hai. Dobara request karein.", 400);
  }

  const isValid = await compareSecret(otp, user.passwordResetOtpHash);
  if (!isValid) return apiError("Invalid OTP", 400);

  user.password = newPassword; // pre-save hook automatically hash kar dega
  user.passwordResetOtpHash = undefined;
  user.passwordResetOtpExpires = undefined;
  await user.save();

  return apiSuccess(null, { message: "Password successfully reset ho gaya hai" });
}