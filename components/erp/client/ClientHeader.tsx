// components/erp/client/ClientHeader.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ClientHeaderProps {
  name: string;
  clientId: string;
}

export default function ClientHeader({ name, clientId }: ClientHeaderProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/auth/client-logout", { method: "POST" });
    router.push("/client-portal");
    router.refresh();
  };

  return (
    <header className="client-header">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Gupta Studio 4u"
            width={40}
            height={40}
            style={{ borderRadius: "var(--radius-full)" }}
          />
          <div>
            <div className="text-white font-semibold">{name}</div>
            <span className="client-id-badge">{clientId}</span>
          </div>
        </div>

        <nav className="flex gap-4">
          <Link href="/client/dashboard" className="text-sm text-muted">
            Dashboard
          </Link>
          <Link href="/client/my-events" className="text-sm text-muted">
            My Events
          </Link>
          <Link href="/client/downloads" className="text-sm text-muted">
            Downloads
          </Link>
          <Link href="/client/payments" className="text-sm text-muted">
            Payments
          </Link>
        </nav>
      </div>

      <button
        type="button"
        className="btn btn-outline btn-sm"
        onClick={handleLogout}
        disabled={loggingOut}
      >
        {loggingOut ? <span className="loader" /> : "Logout"}
      </button>
    </header>
  );
}