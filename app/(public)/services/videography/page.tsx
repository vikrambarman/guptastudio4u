import type { Metadata } from "next";
import CategoryServicesSection from "@/components/public/CategoryServicesSection";

export const metadata: Metadata = {
  title: "Videography Services",
  description: "Cinematic wedding films aur event video shoot services.",
};

export default function VideographyPage() {
  return <CategoryServicesSection category="videography" />;
}