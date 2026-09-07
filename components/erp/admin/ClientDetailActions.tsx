// components/erp/admin/ClientDetailActions.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CredentialsModal from "./CredentialsModal";

interface ClientDetailActionsProps {
  clientId: string;
  name: string;
  phone: string;
  isActive: boolean;
}

export default function ClientDetailActions({
  clientId,
  name,
  phone,
  isActive,
}: ClientDetailActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [revealedPassword, setRevealedPassword] = useState<string | null>(
    null
  );

  const handleReveal = async () => {
    setLoading("reveal");
    try {
      const res = await fetch(`/api/clients/${clientId}/credentials`);
      const result = await res.json();
      if (result.success) {
        setRevealedPassword(result.data.password);
      } else {
        alert(result.error || "Failed to fetch credentials");
      }
    } finally {
      setLoading(null);
    }
  };

  const handleReset = async () => {
    if (
      !confirm(
        "Naya password generate karein? Purana password kaam nahi karega."
      )
    ) {
      return;
    }
    setLoading("reset");
    try {
      const res = await fetch(`/api/clients/${clientId}/credentials`, {
        method: "POST",
      });
      const result = await res.json();
      if (result.success) {
        setRevealedPassword(result.data.password);
      } else {
        alert(result.error || "Failed to reset password");
      }
    } finally {
      setLoading(null);
    }
  };

  const handleToggleActive = async () => {
    setLoading("toggle");
    try {
      await fetch(`/api/clients/${clientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      router.refresh();
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <div className="flex gap-3">
        <button
          className="btn btn-outline btn-sm"
          onClick={handleReveal}
          disabled={loading !== null}
        >
          {loading === "reveal" ? <span className="loader" /> : "👁️ View Password"}
        </button>
        <button
          className="btn btn-outline btn-sm"
          onClick={handleReset}
          disabled={loading !== null}
        >
          {loading === "reset" ? <span className="loader" /> : "🔄 Reset Password"}
        </button>
        <button
          className={`btn btn-sm ${isActive ? "btn-danger" : "btn-success"}`}
          onClick={handleToggleActive}
          disabled={loading !== null}
        >
          {loading === "toggle" ? (
            <span className="loader" />
          ) : isActive ? (
            "Deactivate Client"
          ) : (
            "Activate Client"
          )}
        </button>
      </div>

      {revealedPassword && (
        <CredentialsModal
          clientId={clientId}
          name={name}
          phone={phone}
          password={revealedPassword}
          onClose={() => setRevealedPassword(null)}
        />
      )}
    </>
  );
}