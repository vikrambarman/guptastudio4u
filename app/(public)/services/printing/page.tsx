import type { Metadata } from "next";
import CategoryServicesSection from "@/components/public/CategoryServicesSection";

export const metadata: Metadata = {
  title: "Printing & Merchandise",
  description: "Photo frames, T-shirt, mug printing, ID cards, banners aur binding services.",
};

export default function PrintingPage() {
  return <CategoryServicesSection category="printing" />;
}