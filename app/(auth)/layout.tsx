// app/(auth)/layout.tsx
import AuthProvider from "@/components/shared/AuthProvider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}