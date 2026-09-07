// app/(public)/(home)/page.tsx
import Link from "next/link";
import Hero from "@/components/public/Hero";
import SectionHeading from "@/components/public/SectionHeading";
import { CATEGORY_META } from "@/lib/config/services";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Services Preview */}
      <section className="section">
        <div className="container">
          <SectionHeading
            label="What We Offer"
            title="Our Services"
            description="Shadi se lekar corporate events tak — har zaroorat ke liye complete solutions."
          />

          <div className="grid grid-cols-3 gap-8">
            {CATEGORY_META.map((cat) => (
              <Link
                key={cat.slug}
                href={`/services/${cat.slug}`}
                className="service-card"
                style={{ display: "block", textDecoration: "none" }}
              >
                <div className="service-card-icon">{cat.icon}</div>
                <h3 className="service-card-title">{cat.title}</h3>
                <p className="service-card-desc">{cat.description}</p>
                <span className="text-gold text-sm font-semibold">
                  View Details →
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/services" className="btn btn-outline">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section" style={{ background: "var(--color-black-soft)" }}>
        <div className="container">
          <SectionHeading label="Why Choose Us" title="Har Pal Ko Banate Hain Khaas" />

          <div className="grid grid-cols-3 gap-8">
            <div className="card text-center">
              <div style={{ fontSize: "36px" }} className="mb-4">📸</div>
              <h4 className="text-white mb-2">Professional Quality</h4>
              <p className="text-sm text-muted">
                Experienced team, latest equipment — har shot me quality ka poora khayal.
              </p>
            </div>
            <div className="card text-center">
              <div style={{ fontSize: "36px" }} className="mb-4">⏱️</div>
              <h4 className="text-white mb-2">On-Time Delivery</h4>
              <p className="text-sm text-muted">
                Aapke event ki photos/videos jaldi aur time pe delivered.
              </p>
            </div>
            <div className="card text-center">
              <div style={{ fontSize: "36px" }} className="mb-4">🔒</div>
              <h4 className="text-white mb-2">Secure Client Portal</h4>
              <p className="text-sm text-muted">
                Apni private photos/videos sirf apne Client ID se kabhi bhi access karein.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Client Portal CTA */}
      <section className="section">
        <div className="container">
          <div
            className="card card-gold text-center"
            style={{ padding: "var(--space-16) var(--space-8)" }}
          >
            <h2 className="text-gold mb-4">Apna Event Dekhna Hai?</h2>
            <p className="text-muted mb-8" style={{ maxWidth: "500px", margin: "0 auto var(--space-8)" }}>
              Agar aapka event humare saath hua hai, to apni photos aur videos
              Client Portal me login karke turant dekh sakte hain.
            </p>
            <Link href="/client-portal" className="btn btn-gold btn-lg">
              Client Portal Login
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}