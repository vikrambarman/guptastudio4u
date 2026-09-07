// app/(erp)/client/layout.tsx
import { redirect } from "next/navigation";
import { getClientSession } from "@/lib/auth/getClientSession";
import ClientHeader from "@/components/erp/client/ClientHeader";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = await getClientSession();

  if (!client) {
    redirect("/client-portal");
  }

  return (
    <div className="client-layout">
      <ClientHeader name={client.name} clientId={client.clientId} />
      <div className="erp-content">{children}</div>
    </div>
  );
}