// components/public/ContactForm.tsx
"use client";

import { useState } from "react";
import { CATEGORY_META } from "@/lib/config/services";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();

      if (!result.success) {
        setErrorMsg(result.error || "Something went wrong");
        setStatus("error");
        return;
      }

      setStatus("success");
      setFormData({ name: "", phone: "", email: "", service: "", message: "" });
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="card">
      {status === "success" && (
        <div className="toast toast-success mb-4" style={{ width: "100%" }}>
          <span className="toast-message">
            Aapka message mil gaya hai! Hum jald hi aapse contact karenge.
          </span>
        </div>
      )}
      {status === "error" && (
        <div className="toast toast-error mb-4" style={{ width: "100%" }}>
          <span className="toast-message">{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input
            type="text"
            name="name"
            className="form-input"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={status === "loading"}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Phone *</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={status === "loading"}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              disabled={status === "loading"}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Service Interested In</label>
          <select
            name="service"
            className="form-input form-select"
            value={formData.service}
            onChange={handleChange}
            disabled={status === "loading"}
          >
            <option value="">Select a service</option>
            {CATEGORY_META.map((cat) => (
              <option key={cat.slug} value={cat.title}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Message *</label>
          <textarea
            name="message"
            className="form-input form-textarea"
            value={formData.message}
            onChange={handleChange}
            required
            disabled={status === "loading"}
          />
        </div>

        <button
          type="submit"
          className="btn btn-gold btn-lg mt-2"
          disabled={status === "loading"}
        >
          {status === "loading" ? <span className="loader" /> : "Send Message"}
        </button>
      </form>
    </div>
  );
}