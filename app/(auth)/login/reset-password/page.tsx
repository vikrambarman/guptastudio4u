// app/(auth)/login/reset-password/page.tsx
"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromQuery);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Password match nahi kar raha");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password kam se kam 6 characters ka hona chahiye");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const result = await res.json();
      if (!result.success) {
        setError(result.error || "Reset failed");
        setLoading(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
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
        <h2 className="text-gold font-heading">Reset Password</h2>
        <p className="text-sm text-muted mt-4">OTP aur naya password daalein</p>
      </div>

      {error && (
        <div
          className="toast toast-error"
          style={{ marginBottom: "var(--space-4)", width: "100%" }}
        >
          <span className="toast-message">{error}</span>
        </div>
      )}

      {success ? (
        <div className="payment-received-banner">
          <span>✅</span>
          <span className="text-sm">
            Password reset ho gaya! Login page pe redirect ho rahe hain...
          </span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label className="form-label">OTP</label>
            <input
              type="text"
              className="form-input"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              maxLength={6}
              required
              disabled={loading}
              style={{ letterSpacing: "8px", textAlign: "center" }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="btn btn-gold btn-lg mt-2"
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? <span className="loader" /> : "Reset Password"}
          </button>
        </form>
      )}

      <div className="text-center mt-6">
        <Link href="/login" className="text-sm text-muted">
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
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
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}