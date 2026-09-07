// app/(auth)/client-portal/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ClientPortalLoginPage() {
  const router = useRouter();
  const [clientId, setClientId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/client-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      router.push("/client/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-black)",
        padding: "var(--space-4)",
      }}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "420px",
          borderColor: "var(--color-gold-dark)",
        }}
      >
        <div className="text-center mb-6">
          <Image
            src="/images/logo.png"
            alt="Gupta Studio 4u"
            width={80}
            height={80}
            style={{
              margin: "0 auto var(--space-4)",
              borderRadius: "var(--radius-full)",
            }}
          />
          <h2 className="text-gold font-heading">Client Portal</h2>
          <p className="text-sm text-muted mt-4">
            Apna Client ID aur Password se login karein
          </p>
        </div>

        {error && (
          <div
            className="toast toast-error"
            style={{ marginBottom: "var(--space-4)", width: "100%" }}
          >
            <span className="toast-message">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group">
            <label className="form-label">Client ID</label>
            <input
              type="text"
              className="form-input"
              placeholder="GS4U-2024-001"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
              disabled={loading}
              style={{ textTransform: "uppercase" }}
            />
            <span className="form-hint">
              Ye aapko event ke waqt diya gaya tha
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-gold btn-lg mt-4"
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? <span className="loader" /> : "View My Photos & Videos"}
          </button>
        </form>

        <p
          className="text-xs text-muted text-center mt-6"
          style={{ lineHeight: "var(--lh-relaxed)" }}
        >
          Client ID/Password nahi mila? Studio se contact karein.
        </p>
      </div>
    </div>
  );
}