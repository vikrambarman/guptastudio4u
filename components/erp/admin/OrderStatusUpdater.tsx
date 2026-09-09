// components/erp/admin/OrderStatusUpdater.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface OrderPaymentInfo {
    upiId: string;
    qrImageUrl: string;
    amount: number;
    note: string;
    transactionRef?: string;
    paidAt?: string;
}

interface OrderStatusUpdaterProps {
    orderId: string;
    currentStatus: string;
    subtotal: number;
    discount: number;
    total: number;
    paymentInfo?: OrderPaymentInfo;
}

const STATUS_OPTIONS = [
    "pending",
    "payment_pending",
    "payment_received",
    "processing",
    "completed",
    "cancelled",
];

export default function OrderStatusUpdater({
    orderId,
    currentStatus,
    subtotal,
    discount,
    total,
    paymentInfo,
}: OrderStatusUpdaterProps) {
    const router = useRouter();
    const [form, setForm] = useState({
        status: currentStatus,
        subtotal,
        discount,
        total,
        upiId: paymentInfo?.upiId || "",
        note: paymentInfo?.note || "",
        transactionRef: paymentInfo?.transactionRef || "",
    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = async (markPaid = false) => {
        setSaving(true);
        setSaved(false);
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: form.status,
                    subtotal: form.subtotal,
                    discount: form.discount,
                    total: form.total,
                    paymentInfo: {
                        upiId: form.upiId,
                        amount: form.total,
                        note: form.note,
                        transactionRef: form.transactionRef,
                        markPaid,
                    },
                }),
            });
            const result = await res.json();
            if (result.success) {
                setSaved(true);
                if (markPaid) {
                    setForm((prev) => ({ ...prev, status: "payment_received" }));
                }
                router.refresh();
                setTimeout(() => setSaved(false), 2000);
            } else {
                alert(result.error || "Update failed");
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="permission-toggle-card">
            <div className="permission-row" style={{ display: "block" }}>
                <div className="form-group mb-4">
                    <label className="form-label">Order Status</label>
                    <select
                        className="form-input form-select"
                        value={form.status}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, status: e.target.value }))
                        }
                    >
                        {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                                {s.replace("_", " ").toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="form-group">
                        <label className="form-label">Subtotal (₹)</label>
                        <input
                            type="number"
                            className="form-input"
                            value={form.subtotal}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    subtotal: Number(e.target.value),
                                }))
                            }
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Discount (₹)</label>
                        <input
                            type="number"
                            className="form-input"
                            value={form.discount}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    discount: Number(e.target.value),
                                }))
                            }
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Total (₹)</label>
                        <input
                            type="number"
                            className="form-input"
                            value={form.total}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, total: Number(e.target.value) }))
                            }
                        />
                    </div>
                </div>

                <div className="section-label">Payment Info</div>

                <div className="form-group mb-4">
                    <label className="form-label">Studio UPI ID</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="studio@upi"
                        value={form.upiId}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, upiId: e.target.value }))
                        }
                    />
                </div>

                <div className="form-group mb-4">
                    <label className="form-label">Payment Note (Client ko dikhega)</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Album charges — payment karke screenshot bhejein"
                        value={form.note}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, note: e.target.value }))
                        }
                    />
                </div>

                <div className="form-group mb-4">
                    <label className="form-label">Transaction Reference (UTR)</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. UTR: 402913827461"
                        value={form.transactionRef}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, transactionRef: e.target.value }))
                        }
                    />
                </div>

                {paymentInfo?.paidAt && (
                    <p className="text-xs text-muted mb-4">
                        Paid on: {new Date(paymentInfo.paidAt).toLocaleString("en-IN")}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-3 mt-4">
                <button
                    className="btn btn-dark"
                    onClick={() => handleSave(false)}
                    disabled={saving}
                >
                    {saving ? <span className="loader" /> : "Save Changes"}
                </button>
                <button
                    className="btn btn-gold"
                    onClick={() => handleSave(true)}
                    disabled={saving}
                >
                    {saving ? <span className="loader" /> : "✅ Mark Payment Received"}
                </button>
                {saved && <span className="text-gold text-sm">✓ Saved!</span>}
            </div>
        </div>
    );
}