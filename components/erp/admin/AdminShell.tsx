// components/erp/admin/AdminShell.tsx
"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import type { UserRole } from "@/lib/db/models/User";

interface AdminShellProps {
    user: {
        name: string;
        role: UserRole;
    };
    children: React.ReactNode;
}

export default function AdminShell({ user, children }: AdminShellProps) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="erp-layout">
            <AdminSidebar
                role={user.role}
                mobileOpen={mobileOpen}
                onCloseMobile={() => setMobileOpen(false)}
            />

            {mobileOpen && (
                <div
                    className="erp-sidebar-overlay"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <div className="erp-main">
                <AdminHeader
                    user={user}
                    onToggleMobile={() => setMobileOpen((prev) => !prev)}
                />
                <div className="erp-content">{children}</div>
            </div>
        </div>
    );
}