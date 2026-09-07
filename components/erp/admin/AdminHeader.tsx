// components/erp/admin/AdminHeader.tsx
"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

interface AdminHeaderProps {
    user: {
        name: string;
        role: string;
    };
    onToggleMobile: () => void;
}

export default function AdminHeader({ user, onToggleMobile }: AdminHeaderProps) {
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        await signOut({ callbackUrl: "/login" });
    };

    return (
        <header className="erp-header">
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    className="erp-header-toggle"
                    onClick={onToggleMobile}
                    aria-label="Toggle menu"
                >
                    <span />
                    <span />
                    <span />
                </button>
                <span className="erp-header-title">Welcome, {user.name}</span>
            </div>

            <div className="erp-header-actions">
                <span className="badge badge-gold">
                    {user.role.replace("_", " ")}
                </span>
                <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={handleLogout}
                    disabled={loggingOut}
                >
                    {loggingOut ? <span className="loader" /> : "Logout"}
                </button>
            </div>
        </header>
    );
}