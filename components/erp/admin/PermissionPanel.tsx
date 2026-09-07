// components/erp/admin/PermissionPanel.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { IEventPermissions } from "@/types";

interface PermissionPanelProps {
  eventId: string;
  permissions: IEventPermissions;
}

export default function PermissionPanel({
  eventId,
  permissions,
}: PermissionPanelProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    downloadEnabled: permissions.downloadEnabled,
    paymentRequired: permissions.paymentRequired,
    paymentAmount: permissions.paymentAmount || 0,
    paymentNote: permissions.paymentNote || "",
    paymentStatus: permissions.paymentStatus,
    paymentReferenceNote: permissions.paymentReferenceNote || "",
    expiryDate: permissions.expiryDate
      ? new Date(permissions.expiryDate).toISOString().split("T")[0]
      : "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/events/${eventId}/permissions`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (result.success) {
        setSaved(true);
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
      {/* Download Toggle */}
      <div className="permission-row">
        <div className="permission-info">
          <div className="permission-label">Download Enable Karein</div>
          <div className="permission-desc">
            On karne pe client apni photos/videos download kar sakega
          </div>
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={form.downloadEnabled}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, downloadEnabled: e.target.checked }))
            }
          />
          <span className="toggle-slider" />
        </label>
      </div>

      {/* Payment Required Toggle */}
      <div className="permission-row">
        <div className="permission-info">
          <div className="permission-label">Payment Required</div>
          <div className="permission-desc">
            Off karne pe bina payment ke bhi download enable ho sakta hai
          </div>
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={form.paymentRequired}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, paymentRequired: e.target.checked }))
            }
          />
          <span className="toggle-slider" />
        </label>
      </div>

      {form.paymentRequired && (
        <>
          <div className="permission-row" style={{ display: "block" }}>
            <div className="form-group mb-4">
              <label className="form-label">Payment Amount (₹)</label>
              <input
                type="number"
                className="form-input"
                value={form.paymentAmount}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    paymentAmount: Number(e.target.value),
                  }))
                }
              />
            </div>

            <div className="form-group mb-4">
              <label className="form-label">Payment Note (Client ko dikhega)</label>
              <input
                type="text"
                className="form-input"
                placeholder="UPI pe payment karke screenshot bhejein"
                value={form.paymentNote}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, paymentNote: e.target.value }))
                }
              />
            </div>

            <div className="form-group mb-4">
              <label className="form-label">Payment Status</label>
              <select
                className="form-input form-select"
                value={form.paymentStatus}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    paymentStatus: e.target.value as IEventPermissions["paymentStatus"],
                  }))
                }
              >
                <option value="pending">Pending</option>
                <option value="received">Received</option>
                <option value="not_required">Not Required</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Payment Reference (UTR / Transaction ID)
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. UTR: 402913827461"
                value={form.paymentReferenceNote}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    paymentReferenceNote: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </>
      )}

      <div className="permission-row" style={{ display: "block" }}>
        <div className="form-group">
          <label className="form-label">Download Expiry Date (Optional)</label>
          <input
            type="date"
            className="form-input"
            value={form.expiryDate}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, expiryDate: e.target.value }))
            }
          />
          <span className="form-hint">
            Is date ke baad client download nahi kar payega
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <button
          className="btn btn-gold"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? <span className="loader" /> : "Save Permissions"}
        </button>
        {saved && <span className="text-gold text-sm">✓ Saved!</span>}
      </div>

      {/* Current Status Banner */}
      <div className="mt-6">
        {permissions.paymentStatus === "received" ||
        !permissions.paymentRequired ? (
          <div className="payment-received-banner">
            <span>✅</span>
            <span className="text-sm">
              Payment {permissions.paymentRequired ? "received" : "not required"} —
              download {permissions.downloadEnabled ? "enabled" : "still disabled"}
            </span>
          </div>
        ) : (
          <div className="payment-pending-banner">
            <span>⏳</span>
            <span className="text-sm">Payment abhi pending hai</span>
          </div>
        )}
      </div>
    </div>
  );
}