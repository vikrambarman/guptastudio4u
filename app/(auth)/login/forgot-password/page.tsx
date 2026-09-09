// app/(auth)/login/forgot-password/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const result = await res.json();
            setMessage(
                result.message ||
                "Agar email registered hai, reset OTP bhej diya gaya hai."
            );
            setSubmitted(true);
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
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
                    <h2 className="text-gold font-heading">Forgot Password</h2>
                    <p className="text-sm text-muted mt-4">
                        Apna registered email daalein, hum reset OTP bhej denge.
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

                {submitted ? (
                    <div>
                        <div className="payment-received-banner mb-4">
                            <span>✅</span>
                            <span className="text-sm">{message}</span>
                        </div>
                        <Link
                            href={`/login/reset-password?email=${encodeURIComponent(email)}`}
                            className="btn btn-gold"
                            style={{ width: "100%", textAlign: "center" }}
                        >
                            OTP Enter Karein
                        </Link>
                    </div>
                ) : (
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
                        <button
                            type="submit"
                            className="btn btn-gold btn-lg"
                            disabled={loading}
                            style={{ width: "100%" }}
                        >
                            {loading ? <span className="loader" /> : "Send Reset OTP"}
                        </button>
                    </form>
                )}

                <div className="text-center mt-6">
                    <Link href="/login" className="text-sm text-muted">
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}