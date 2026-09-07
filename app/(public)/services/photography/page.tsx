import type { Metadata } from "next";
import CategoryServicesSection from "@/components/public/CategoryServicesSection";

export const metadata: Metadata = {
  title: "Photography Services",
  description: "Wedding, birthday aur event photography services by Gupta Studio 4u.",
};

export default function PhotographyPage() {
  return <CategoryServicesSection category="photography" />;
}