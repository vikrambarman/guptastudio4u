// components/erp/admin/BackupCodesManager.tsx
"use client";

import { useState, useEffect } from "react";

export default function BackupCodesManager() {
    const [remaining, setRemaining] = useState<number | null>(null);
    const [generatedAt, setGeneratedAt] = useState<string | null>(null);
    const [newCodes, setNewCodes] = useState<string[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        fetch("/api/admin/backup-codes")
            .then((res) => res.json())
            .then((result) => {
                if (result.success) {
                    setRemaining(result.data.remainingCodes);
                    setGeneratedAt(result.data.generatedAt);
                }
            })
            .finally(() => setFetching(false));
    }, []);

    const handleGenerate = async () => {
        if (
            remaining !== null &&
            remaining > 0 &&
            !confirm(
                "Naye backup codes generate karne se purane sab codes invalid ho jayenge. Continue karein?"
            )
        ) {
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/admin/backup-codes", { method: "POST" });
            const result = await res.json();
            if (result.success) {
                setNewCodes(result.data.codes);
                setRemaining(result.data.codes.length);
                setGeneratedAt(new Date().toISOString());
            } else {
                alert(result.error || "Generate failed");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!newCodes) return;
        const text = `Gupta Studio 4u - Backup Codes\nGenerated: ${new Date().toLocaleString(
            "en-IN"
        )}\n\n${newCodes.join("\n")}\n\nHar code sirf ek baar use ho sakta hai.`;
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "gupta-studio-4u-backup-codes.txt";
        link.click();
        URL.revokeObjectURL(url);
    };

    if (fetching) return <span className="loader" />;

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="text-sm text-white">
                        {remaining !== null && remaining > 0
                            ? `${remaining} backup codes available hain`
                            : "Koi backup codes generate nahi kiye hain"}
                    </div>
                    {generatedAt && (
                        <div className="text-xs text-muted mt-1">
                            Last generated: {new Date(generatedAt).toLocaleDateString("en-IN")}
                        </div>
                    )}
                </div>
                <button
                    className="btn btn-outline btn-sm"
                    onClick={handleGenerate}
                    disabled={loading}
                >
                    {loading ? (
                        <span className="loader" />
                    ) : remaining && remaining > 0 ? (
                        "🔄 Regenerate Codes"
                    ) : (
                        "🔑 Generate Backup Codes"
                    )}
                </button>
            </div>

            {newCodes && (
                <div className="card-gold" style={{ padding: "var(--space-4)" }}>
                    <p className="text-sm text-gold font-semibold mb-3">
                        ⚠️ Ye codes sirf ek baar dikhenge — abhi save/download kar lein!
                    </p>
                    <div
                        className="grid grid-cols-2 gap-2 mb-4"
                        style={{ fontFamily: "var(--font-accent)" }}
                    >
                        {newCodes.map((code) => (
                            <div
                                key={code}
                                className="badge badge-gray"
                                style={{ justifyContent: "center", padding: "var(--space-2)" }}
                            >
                                {code}
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-gold btn-sm" onClick={handleDownload}>
                        ⬇️ Download as .txt
                    </button>
                </div>
            )}
        </div>
    );
}