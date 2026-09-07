// components/public/CategoryServicesSection.tsx
import Link from "next/link";
import type { ServiceCategory } from "@/types";
import { getCategoryMeta, getServicesByCategory } from "@/lib/config/services";
import SectionHeading from "./SectionHeading";
import ServiceCard from "./ServiceCard";

export default function CategoryServicesSection({
  category,
}: {
  category: ServiceCategory;
}) {
  const meta = getCategoryMeta(category);
  const services = getServicesByCategory(category);

  return (
    <div className="public-page section">
      <div className="container">
        <SectionHeading
          label="Our Services"
          title={meta?.title || "Services"}
          description={meta?.description}
        />

        {services.length === 0 ? (
          <p className="text-center text-muted">
            Is category ki services jald hi add ki jayengi.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <p className="text-muted mb-4">Koi custom requirement hai?</p>
          <Link href="/contact" className="btn btn-gold">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}