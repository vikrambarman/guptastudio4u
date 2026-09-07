// components/public/ServiceCard.tsx
import type { IService } from "@/types";
import { STUDIO_CONFIG } from "@/lib/config/studio";

interface ServiceCardProps {
  service: IService;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const whatsappUrl = `https://wa.me/${STUDIO_CONFIG.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Namaste, mujhe "${service.title}" service ke baare me jaankari chahiye.`
  )}`;

  return (
    <div className="service-card">
      {service.isPopular && (
        <span
          className="badge badge-gold"
          style={{ position: "absolute", top: "16px", right: "16px" }}
        >
          Popular
        </span>
      )}

      <div className="service-card-icon">{service.icon}</div>
      <h3 className="service-card-title">{service.title}</h3>
      <p className="service-card-desc">{service.description}</p>

      {service.features.length > 0 && (
        <div className="service-card-features">
          {service.features.map((feature) => (
            <div key={feature} className="service-feature">
              {feature}
            </div>
          ))}
        </div>
      )}

      {service.priceStarting !== undefined && (
        <div className="text-gold font-semibold mb-4">
          Starting ₹{service.priceStarting}
          {service.priceUnit ? ` / ${service.priceUnit}` : ""}
        </div>
      )}

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-outline btn-sm"
        style={{ width: "100%", textAlign: "center" }}
      >
        Enquire Now
      </a>
    </div>
  );
}