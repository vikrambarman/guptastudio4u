// components/erp/admin/CredentialsModal.tsx
"use client";

import { useState } from "react";

interface CredentialsModalProps {
  clientId: string;
  name: string;
  phone: string;
  password: string;
  onClose: () => void;
}

export default function CredentialsModal({
  clientId,
  name,
  phone,
  password,
  onClose,
}: CredentialsModalProps) {
  const [copied, setCopied] = useState(false);

  const credentialsText = `Namaste ${name || "ji"},

Aapka Gupta Studio 4u Client Portal account ban gaya hai.

Client ID: ${clientId}
Password: ${password}

Login karein: ${process.env.NEXT_PUBLIC_APP_URL}/client-portal

Event ke din QR code scan karke bhi login kar sakte hain.

Dhanyawad,
Gupta Studio 4u`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(credentialsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappUrl = phone
    ? `https://wa.me/91${phone}?text=${encodeURIComponent(credentialsText)}`
    : null;

  return (
    <div className="modal-backdrop">
      <div className="modal" style={{ maxWidth: "480px" }}>
        <div className="modal-header">
          <span className="modal-title text-gold">Client Credentials</span>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div
            className="card card-gold mb-6"
            style={{ padding: "var(--space-5)", position: "relative" }}
          >
            <div className="flex justify-between mb-4">
              <span className="text-muted text-sm">Client ID</span>
              <span className="text-gold font-bold">{clientId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted text-sm">Password</span>
              <span className="text-gold font-bold">{password}</span>
            </div>
          </div>

          <p className="text-sm text-muted mb-4">
            ⚠️ Password sambhal kar rakhein ya turant client ko bhej dein.
          </p>

          <div className="flex gap-3">
            <button
              className="btn btn-outline"
              onClick={handleCopy}
              style={{ flex: 1 }}
            >
              {copied ? "✓ Copied!" : "📋 Copy Details"}
            </button>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold"
                style={{ flex: 1, textAlign: "center" }}
              >
                WhatsApp Bhejein
              </a>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-dark" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}