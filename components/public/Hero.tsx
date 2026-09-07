// components/public/Hero.tsx
import Link from "next/link";
import { STUDIO_CONFIG } from "@/lib/config/studio";

const STATS = [
  { value: "5+", label: "Years Experience" },
  { value: "500+", label: "Events Covered" },
  { value: "1000+", label: "Happy Clients" },
  { value: "50K+", label: "Photos Delivered" },
];

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-particles" />
      <div className="hero-bg-overlay" />

      <div className="container hero-content">
        <div className="hero-eyebrow">Photography &amp; Videography Studio</div>
        <h1 className="hero-title">
          Har Pal Ko Banayein <span className="text-gradient-gold">Yaadgar</span>
        </h1>
        <p className="hero-subtitle">
          {STUDIO_CONFIG.name} me hum shadi, birthday, corporate events se
          lekar decoration, printing aur DJ setup tak — har zaroorat ko
          professional andaaz me poora karte hain.
        </p>

        <div className="hero-actions">
          <Link href="/services" className="btn btn-gold btn-lg">
            Explore Services
          </Link>
          <Link href="/contact" className="btn btn-outline btn-lg">
            Book Now
          </Link>
        </div>

        <div className="hero-stats">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <div className="hero-stat-num">{stat.value}</div>
              <div className="hero-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-scroll">
        <span>Scroll</span>
        <div className="hero-scroll-line" />
      </div>
    </section>
  );
}