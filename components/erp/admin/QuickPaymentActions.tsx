// components/erp/admin/QuickPaymentActions.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface QuickPaymentActionsProps {
    type: "event" | "order";
    id: string; // eventId ya orderId
}

export default function QuickPaymentActions({
    type,
    id,
}: QuickPaymentActionsProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleMarkReceived = async () => {
        if (!confirm("Payment received mark karna hai?")) return;
        setLoading(true);
        try {
            const url =
                type === "event" ? `/api/events/${id}/permissions` : `/api/orders/${id}`;

            const body =
                type === "event"
                    ? { paymentStatus: "received" }
                    : { paymentInfo: { markPaid: true } };

            const res = await fetch(url, {
                method: type === "event" ? "PUT" : "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const result = await res.json();
            if (result.success) {
                router.refresh();
            } else {
                alert(result.error || "Update failed");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            className="btn btn-gold btn-sm"
            onClick={handleMarkReceived}
            disabled={loading}
        >
            {loading ? <span className="loader" /> : "✅ Mark Received"}
        </button>
    );
}