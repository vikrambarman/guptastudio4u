// auth.ts (root level - next-auth v5 convention)
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/authOptions";

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);