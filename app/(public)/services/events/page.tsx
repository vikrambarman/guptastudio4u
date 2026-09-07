import type { Metadata } from "next";
import CategoryServicesSection from "@/components/public/CategoryServicesSection";

export const metadata: Metadata = {
  title: "Event Management",
  description: "Wedding planning, birthday party planning aur corporate event management.",
};

export default function EventsPage() {
  return <CategoryServicesSection category="events" />;
}