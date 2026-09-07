// lib/config/navigation.ts
import type { UserRole } from "@/lib/db/models/User";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: string;
  roles?: UserRole[]; // undefined = sabko dikhega
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/admin/dashboard", icon: "📊" }],
  },
  {
    label: "Management",
    items: [
      { label: "Clients", href: "/admin/clients", icon: "👥" },
      { label: "Events", href: "/admin/events", icon: "📅" },
      { label: "Orders", href: "/admin/orders", icon: "🛒" },
      {
        label: "Payments",
        href: "/admin/payments",
        icon: "💰",
        roles: ["super_admin", "admin"],
      },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Gallery", href: "/admin/gallery", icon: "🖼️" },
      {
        label: "Services",
        href: "/admin/services",
        icon: "🎯",
        roles: ["super_admin", "admin"],
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        label: "Settings",
        href: "/admin/settings",
        icon: "⚙️",
        roles: ["super_admin"],
      },
    ],
  },
];