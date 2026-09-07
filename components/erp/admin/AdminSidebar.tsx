// components/erp/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_GROUPS } from "@/lib/config/navigation";
import type { UserRole } from "@/lib/db/models/User";

interface AdminSidebarProps {
    role: UserRole;
    mobileOpen: boolean;
    onCloseMobile: () => void;
}

export default function AdminSidebar({
    role,
    mobileOpen,
    onCloseMobile,
}: AdminSidebarProps) {
    const pathname = usePathname();

    return (
        <aside className={`erp-sidebar ${mobileOpen ? "mobile-open" : ""}`}>
            <div className="erp-sidebar-header">
                <Image
                    src="/images/logo.png"
                    alt="Gupta Studio 4u"
                    width={40}
                    height={40}
                    className="erp-sidebar-logo"
                />
                <div className="erp-sidebar-brand">
                    <div className="erp-sidebar-brand-name">Gupta Studio 4u</div>
                    <div className="erp-sidebar-brand-sub">Admin Panel</div>
                </div>
            </div>

            <nav className="erp-nav">
                {ADMIN_NAV_GROUPS.map((group) => {
                    const visibleItems = group.items.filter(
                        (item) => !item.roles || item.roles.includes(role)
                    );

                    if (visibleItems.length === 0) return null;

                    return (
                        <div key={group.label}>
                            <div className="erp-nav-group-label">{group.label}</div>
                            <div className="flex flex-col gap-2">
                                {visibleItems.map((item) => {
                                    const isActive =
                                        pathname === item.href ||
                                        (item.href !== "/admin/dashboard" &&
                                            pathname.startsWith(item.href));

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={onCloseMobile}
                                            className={`erp-nav-item ${isActive ? "active" : ""}`}
                                        >
                                            <span className="erp-nav-item-icon">{item.icon}</span>
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
}