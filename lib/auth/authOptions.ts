// lib/auth/authOptions.ts
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDB from "@/lib/db/mongodb";
import User, { UserRole } from "@/lib/db/models/User";
import { verifyLoginToken } from "@/lib/auth/loginToken";
import { compareSecret, findMatchingBackupCode } from "@/lib/auth/twoFactor";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        loginToken: { label: "Login Token", type: "text" },
        otp: { label: "OTP", type: "text" },
        backupCode: { label: "Backup Code", type: "text" },
      },
      /**
       * ⚠️ Ye ab DIRECT email+password accept NAHI karta.
       * Poora flow 2-step hai:
       * 1) POST /api/auth/request-otp - email+password verify, OTP bhejo,
       *    loginToken (temp, 5min) return karo
       * 2) signIn("credentials", {loginToken, otp}) - yaha OTP verify hoke
       *    hi asli session banta hai
       *
       * Isse guarantee milta hai ki KOI BHI login OTP verify kiye bina
       * complete nahi ho sakta.
       */
      async authorize(credentials) {
        const loginToken = credentials?.loginToken as string | undefined;
        const otp = credentials?.otp as string | undefined;
        const backupCode = credentials?.backupCode as string | undefined;

        if (!loginToken || (!otp && !backupCode)) {
          throw new Error("Invalid verification request. Please login again.");
        }

        const payload = verifyLoginToken(loginToken);
        if (!payload) {
          throw new Error("Login session expired. Please login again.");
        }

        await connectDB();

        const user = await User.findById(payload.userId).select(
          "+twoFactorOtpHash +twoFactorOtpExpires +backupCodes"
        );

        if (!user) throw new Error("Account not found");
        if (!user.isActive) {
          throw new Error("Your account has been deactivated. Contact admin.");
        }

        if (otp) {
          if (!user.twoFactorOtpHash || !user.twoFactorOtpExpires) {
            throw new Error("No OTP request found. Please login again.");
          }
          if (new Date() > user.twoFactorOtpExpires) {
            throw new Error("OTP expired. Please login again.");
          }
          const isValid = await compareSecret(otp, user.twoFactorOtpHash);
          if (!isValid) throw new Error("Invalid OTP");

          user.twoFactorOtpHash = undefined;
          user.twoFactorOtpExpires = undefined;
          await user.save();
        } else if (backupCode) {
          const codes = user.backupCodes || [];
          const matchIndex = await findMatchingBackupCode(codes, backupCode);
          if (matchIndex === -1) throw new Error("Invalid backup code");

          codes.splice(matchIndex, 1);
          user.backupCodes = codes;
          await user.save();
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role: UserRole }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
};