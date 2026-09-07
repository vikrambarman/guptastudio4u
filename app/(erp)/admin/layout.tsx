// app/(erp)/admin/layout.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminShell from "@/components/erp/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Defense-in-depth: proxy.ts already protect karta hai,
  // ye layout-level double check hai
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <AdminShell
      user={{
        name: session.user.name,
        role: session.user.role,
      }}
    >
      {children}
    </AdminShell>
  );
}