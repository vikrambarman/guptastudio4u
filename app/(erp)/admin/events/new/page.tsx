// app/(erp)/admin/events/new/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ClientSelector from "@/components/erp/admin/ClientSelector";

interface ClientOption {
  clientId: string;
  name: string;
  phone: string;
}

const EVENT_TYPES = [
  { value: "wedding", label: "Wedding / Shadi" },
  { value: "birthday", label: "Birthday Party" },
  { value: "party", label: "Party" },
  { value: "corporate", label: "Corporate Event" },
  { value: "maternity", label: "Maternity Shoot" },
  { value: "product", label: "Product Shoot" },
  { value: "other", label: "Other" },
];

export default function NewEventPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillClientId = searchParams.get("clientId");

  const [client, setClient] = useState<ClientOption | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    eventType: "wedding",
    eventDate: "",
    venue: "",
    description: "",
    packageName: "",
    packagePrice: "",
    packageIncludes: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Agar URL me clientId aaya hai (Client Detail page se), auto-fetch karo
  useEffect(() => {
    if (!prefillClientId) return;
    fetch(`/api/clients/${prefillClientId}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setClient({
            clientId: result.data.client.clientId,
            name: result.data.client.name,
            phone: result.data.client.phone,
          });
        }
      });
  }, [prefillClientId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!client) {
      setError("Pehle client select karein");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, clientId: client.clientId }),
      });
      const result = await res.json();

      if (!result.success) {
        setError(result.error || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push(`/admin/events/${result.data.eventId}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-gold mb-6">Create New Event</h1>

      <div className="card" style={{ maxWidth: "640px" }}>
        {error && (
          <div className="toast toast-error mb-4" style={{ width: "100%" }}>
            <span className="toast-message">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <ClientSelector selected={client} onSelect={setClient} />

          <div className="form-group">
            <label className="form-label">Event Title *</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="e.g. Sharma Ji Ki Shadi"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Event Type *</label>
              <select
                name="eventType"
                className="form-input form-select"
                value={formData.eventType}
                onChange={handleChange}
                disabled={loading}
              >
                {EVENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Event Date *</label>
              <input
                type="date"
                name="eventDate"
                className="form-input"
                value={formData.eventDate}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Venue *</label>
            <input
              type="text"
              name="venue"
              className="form-input"
              placeholder="e.g. Radhe Krishna Garden, Ambikapur"
              value={formData.venue}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-input form-textarea"
              placeholder="Event ke baare me kuch notes..."
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="section-label">Package Details (Optional)</div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Package Name</label>
              <input
                type="text"
                name="packageName"
                className="form-input"
                placeholder="e.g. Premium Wedding Package"
                value={formData.packageName}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Package Price (₹)</label>
              <input
                type="number"
                name="packagePrice"
                className="form-input"
                placeholder="25000"
                value={formData.packagePrice}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Package Includes</label>
            <input
              type="text"
              name="packageIncludes"
              className="form-input"
              placeholder="Photography, Videography, Album (comma se alag karein)"
              value={formData.packageIncludes}
              onChange={handleChange}
              disabled={loading}
            />
            <span className="form-hint">Comma (,) se alag alag likhein</span>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              className="btn btn-gold"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? <span className="loader" /> : "Create Event"}
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
    </div>
  );
}