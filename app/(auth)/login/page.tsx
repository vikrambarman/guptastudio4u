// app/(auth)/login/page.tsx
"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await res.json();

      if (!result.success) {
        setError(result.error || "Invalid email or password");
        setLoading(false);
        return;
      }

      // Login token ko sessionStorage me rakho (URL me kabhi nahi - security)
      sessionStorage.setItem("gs4u_login_token", result.data.loginToken);
      sessionStorage.setItem("gs4u_login_email", result.data.email);

      router.push(
        `/login/verify-otp?callbackUrl=${encodeURIComponent(callbackUrl)}`
      );
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
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
        <h2 className="text-gold font-heading">Admin Login</h2>
        <p className="text-sm text-muted mt-4">
          Gupta Studio 4u Management Panel
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
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-input"
            placeholder="admin@guptastudio4u.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
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
          <div className="text-right mt-2">
            <Link href="/login/forgot-password" className="text-xs text-gold">
              Forgot Password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-gold btn-lg mt-4"
          disabled={loading}
          style={{ width: "100%" }}
        >
          {loading ? <span className="loader" /> : "Continue"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
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
      <Suspense fallback={<span className="loader loader-lg" />}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}