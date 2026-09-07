// app/(erp)/admin/clients/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CredentialsModal from "@/components/erp/admin/CredentialsModal";

interface CreatedClient {
  clientId: string;
  name: string;
  phone: string;
  password: string;
}

export default function NewClientPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdClient, setCreatedClient] = useState<CreatedClient | null>(
    null
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!result.success) {
        setError(result.error || "Something went wrong");
        setLoading(false);
        return;
      }

      setCreatedClient(result.data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    if (createdClient) {
      router.push(`/admin/clients/${createdClient.clientId}`);
    }
  };

  return (
    <div>
      <h1 className="text-gold mb-6">Register New Client</h1>

      <div className="card" style={{ maxWidth: "560px" }}>
        {error && (
          <div className="toast toast-error mb-4" style={{ width: "100%" }}>
            <span className="toast-message">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="e.g. Ramesh Sharma"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              placeholder="10-digit mobile number"
              value={formData.phone}
              onChange={handleChange}
              maxLength={10}
              required
              disabled={loading}
            />
            <span className="form-hint">
              WhatsApp pe credentials isi number pe bhejenge
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Email (Optional)</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="client@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Address (Optional)</label>
            <textarea
              name="address"
              className="form-input form-textarea"
              placeholder="Client ka address"
              value={formData.address}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              className="btn btn-gold"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? <span className="loader" /> : "Register Client"}
            </button>
            <button
              type="button"
              className="btn btn-dark"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {createdClient && (
        <CredentialsModal
          clientId={createdClient.clientId}
          name={createdClient.name}
          phone={createdClient.phone}
          password={createdClient.password}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}