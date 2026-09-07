// app/(public)/services/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/public/SectionHeading";
import ServiceCard from "@/components/public/ServiceCard";
import { CATEGORY_META, getServicesByCategory } from "@/lib/config/services";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Photography, videography, decoration, printing aur event management services.",
};

export default function ServicesHubPage() {
  const otherServices = getServicesByCategory("other");

  return (
    <div className="public-page section">
      <div className="container">
        <SectionHeading
          label="What We Offer"
          title="Our Services"
          description="Shadi se lekar corporate events tak — har zaroorat ke liye complete solutions."
        />

        <div className="grid grid-cols-3 gap-8 mb-16">
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
              <span className="text-gold text-sm font-semibold">View Details →</span>
            </Link>
          ))}
        </div>

        {otherServices.length > 0 && (
          <>
            <SectionHeading label="Also Available" title="Other Services" />
            <div className="grid grid-cols-3 gap-8">
              {otherServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}