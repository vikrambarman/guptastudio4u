// app/(auth)/login/verify-otp/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";

function VerifyOtpForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";

    const [loginToken, setLoginToken] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [useBackupCode, setUseBackupCode] = useState(false);
    const [backupCode, setBackupCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [resendMsg, setResendMsg] = useState("");

    useEffect(() => {
        const token = sessionStorage.getItem("gs4u_login_token");
        const savedEmail = sessionStorage.getItem("gs4u_login_email");
        if (!token) {
            router.push("/login");
            return;
        }
        setLoginToken(token);
        setEmail(savedEmail || "");
    }, [router]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                loginToken,
                otp: useBackupCode ? undefined : otp,
                backupCode: useBackupCode ? backupCode : undefined,
                redirect: false,
            });

            if (result?.error) {
                setError(result.error || "Verification failed");
                setLoading(false);
                return;
            }

            sessionStorage.removeItem("gs4u_login_token");
            sessionStorage.removeItem("gs4u_login_email");

            router.push(callbackUrl);
            router.refresh();
        } catch {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setResendMsg("");
        setError("");
        try {
            const res = await fetch("/api/auth/resend-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ loginToken }),
            });
            const result = await res.json();
            if (result.success) {
                sessionStorage.setItem("gs4u_login_token", result.data.loginToken);
                setLoginToken(result.data.loginToken);
                setResendMsg("Naya OTP bhej diya gaya hai!");
            } else {
                setError(result.error || "Resend failed");
            }
        } finally {
            setResending(false);
        }
    };

    if (!loginToken) {
        return <span className="loader loader-lg" />;
    }

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
                <h2 className="text-gold font-heading">Verify OTP</h2>
                <p className="text-sm text-muted mt-4">
                    {email ? `${email} pe bheja gaya OTP daalein` : "Apna OTP daalein"}
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
            {resendMsg && (
                <div
                    className="toast toast-success"
                    style={{ marginBottom: "var(--space-4)", width: "100%" }}
                >
                    <span className="toast-message">{resendMsg}</span>
                </div>
            )}

            <form onSubmit={handleVerify} className="flex flex-col gap-4">
                {!useBackupCode ? (
                    <div className="form-group">
                        <label className="form-label">6-Digit OTP</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="000000"
                            value={otp}
                            onChange={(e) =>
                                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                            }
                            maxLength={6}
                            required
                            disabled={loading}
                            style={{
                                letterSpacing: "8px",
                                textAlign: "center",
                                fontSize: "var(--fs-xl)",
                            }}
                            autoFocus
                        />
                    </div>
                ) : (
                    <div className="form-group">
                        <label className="form-label">Backup Code</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="XXXX-XXXX"
                            value={backupCode}
                            onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
                            required
                            disabled={loading}
                            style={{ textAlign: "center", letterSpacing: "2px" }}
                            autoFocus
                        />
                    </div>
                )}

                <button
                    type="submit"
                    className="btn btn-gold btn-lg"
                    disabled={loading}
                    style={{ width: "100%" }}
                >
                    {loading ? <span className="loader" /> : "Verify & Login"}
                </button>

                <div className="flex items-center justify-between mt-2">
                    <button
                        type="button"
                        className="text-xs text-gold"
                        style={{ background: "none", border: "none", cursor: "pointer" }}
                        onClick={() => {
                            setUseBackupCode((prev) => !prev);
                            setError("");
                        }}
                    >
                        {useBackupCode ? "OTP use karein" : "Backup code use karein"}
                    </button>

                    {!useBackupCode && (
                        <button
                            type="button"
                            className="text-xs text-muted"
                            style={{ background: "none", border: "none", cursor: "pointer" }}
                            onClick={handleResend}
                            disabled={resending}
                        >
                            {resending ? "Sending..." : "Resend OTP"}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default function VerifyOtpPage() {
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
                <VerifyOtpForm />
            </Suspense>
        </div>
    );
}