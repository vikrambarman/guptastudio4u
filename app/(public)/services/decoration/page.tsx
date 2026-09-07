import type { Metadata } from "next";
import CategoryServicesSection from "@/components/public/CategoryServicesSection";

export const metadata: Metadata = {
  title: "Decoration & DJ Services",
  description: "Wedding decoration, birthday decoration aur DJ setup services.",
};

export default function DecorationPage() {
  return <CategoryServicesSection category="decoration" />;
}