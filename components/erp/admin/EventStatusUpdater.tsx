// components/erp/admin/EventStatusUpdater.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { EventStatus } from "@/lib/db/models/Event";

const STATUS_OPTIONS: EventStatus[] = [
  "upcoming",
  "ongoing",
  "completed",
  "delivered",
];

export default function EventStatusUpdater({
  eventId,
  currentStatus,
}: {
  eventId: string;
  currentStatus: EventStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
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
    <div className="flex items-center gap-3">
      <select
        className="form-input form-select"
        value={status}
        onChange={(e) => setStatus(e.target.value as EventStatus)}
        style={{ maxWidth: "180px" }}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </option>
        ))}
      </select>
      <button
        className="btn btn-gold btn-sm"
        onClick={handleUpdate}
        disabled={loading || status === currentStatus}
      >
        {loading ? <span className="loader" /> : "Update Status"}
      </button>
    </div>
  );
}