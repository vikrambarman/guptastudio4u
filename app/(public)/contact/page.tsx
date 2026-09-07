// app/(public)/contact/page.tsx
import type { Metadata } from "next";
import ContactForm from "@/components/public/ContactForm";
import { STUDIO_CONFIG } from "@/lib/config/studio";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `${STUDIO_CONFIG.name} se contact karein — booking, enquiry ya kisi bhi jaankari ke liye.`,
};

export default function ContactPage() {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    STUDIO_CONFIG.address
  )}`;

  return (
    <div className="public-page section">
      <div className="container">
        <div className="section-label" style={{ justifyContent: "center" }}>
          Get In Touch
        </div>
        <h2 className="text-center mb-12">Contact Us</h2>

        <div className="grid grid-cols-2 gap-12">
          <ContactForm />

          <div className="flex flex-col gap-6">
            <div className="card">
              <div className="section-label">Phone</div>
              <a href={`tel:${STUDIO_CONFIG.phone}`} className="text-white text-lg">
                {STUDIO_CONFIG.phone}
              </a>
            </div>
            <div className="card">
              <div className="section-label">Email</div>
              <a href={`mailto:${STUDIO_CONFIG.email}`} className="text-white text-lg">
                {STUDIO_CONFIG.email}
              </a>
            </div>
            <div className="card">
              <div className="section-label">Address</div>
              <p className="text-white-soft mb-4">{STUDIO_CONFIG.address}</p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}