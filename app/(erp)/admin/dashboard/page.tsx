// app/(erp)/admin/dashboard/page.tsx
import { auth } from "@/auth";

export default async function AdminDashboardPage() {
  const session = await auth();

  return (
    <div className="erp-content">
      <h1 className="text-gold">Welcome, {session?.user?.name}!</h1>
      <p className="text-muted mt-4">Role: {session?.user?.role}</p>
      <p className="text-muted">Email: {session?.user?.email}</p>
    </div>
  );
}