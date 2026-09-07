// components/public/Footer.tsx
import Link from "next/link";
import { STUDIO_CONFIG } from "@/lib/config/studio";
import { CATEGORY_META } from "@/lib/config/services";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <span className="navbar-logo-main text-gold font-heading text-xl">
              {STUDIO_CONFIG.name}
            </span>
            <p className="footer-brand-desc">
              Aapki khushiyon ke har pal ko professional andaaz me kaid karte
              hain — photography, videography aur events ki complete services
              ek hi jagah.
            </p>
            <div className="footer-social">
              <a href="#" className="footer-social-btn" aria-label="Facebook">
                📘
              </a>
              <a href="#" className="footer-social-btn" aria-label="Instagram">
                📷
              </a>
              <a
                href={`https://wa.me/${STUDIO_CONFIG.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="WhatsApp"
              >
                💬
              </a>
            </div>
          </div>

          <div>
            <div className="footer-heading">Quick Links</div>
            <div className="footer-links">
              <Link href="/about" className="footer-link">About Us</Link>
              <Link href="/gallery" className="footer-link">Gallery</Link>
              <Link href="/contact" className="footer-link">Contact</Link>
              <Link href="/client-portal" className="footer-link">Client Portal</Link>
            </div>
          </div>

          <div>
            <div className="footer-heading">Services</div>
            <div className="footer-links">
              {CATEGORY_META.map((cat) => (
                <Link key={cat.slug} href={`/services/${cat.slug}`} className="footer-link">
                  {cat.title}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="footer-heading">Contact</div>
            <div className="footer-links">
              <span className="footer-link" style={{ cursor: "default" }}>
                📞 {STUDIO_CONFIG.phone}
              </span>
              <span className="footer-link" style={{ cursor: "default" }}>
                ✉️ {STUDIO_CONFIG.email}
              </span>
              <span className="footer-link" style={{ cursor: "default" }}>
                📍 {STUDIO_CONFIG.address}
              </span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copyright">
            © {year} {STUDIO_CONFIG.name}. All rights reserved.
          </span>
          <Link href="/login" className="footer-copyright text-muted">
            Staff Login
          </Link>
        </div>
      </div>
    </footer>
  );
}