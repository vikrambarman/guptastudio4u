// components/public/Navbar.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { STUDIO_CONFIG } from "@/lib/config/studio";

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        onScroll();
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    return (
        <header className={`navbar ${scrolled ? "navbar-scrolled" : "navbar-transparent"}`}>
            <div className="container navbar-inner">
                <Link href="/" className="navbar-logo">
                    <Image
                        src="/images/logo.png"
                        alt={STUDIO_CONFIG.name}
                        width={50}
                        height={50}
                        className="navbar-logo-img"
                    />
                    <span className="navbar-logo-text">
                        <span className="navbar-logo-main">{STUDIO_CONFIG.name}</span>
                        <span className="navbar-logo-sub">Photography Studio</span>
                    </span>
                </Link>

                <ul className="navbar-links">
                    {NAV_LINKS.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className={`navbar-link ${pathname === link.href ? "active" : ""}`}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-3">
                    <Link href="/client-portal" className="btn btn-gold btn-sm">
                        Client Login
                    </Link>
                    <button
                        type="button"
                        className="navbar-toggle"
                        onClick={() => setMobileOpen((prev) => !prev)}
                        aria-label="Toggle menu"
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                </div>
            </div>

            <div className={`navbar-mobile ${mobileOpen ? "open" : ""}`}>
                <ul className="navbar-mobile-links">
                    {NAV_LINKS.map((link) => (
                        <li key={link.href}>
                            <Link href={link.href} className="navbar-mobile-link">
                                {link.label}
                            </Link>
                        </li>
                    ))}
                    <li>
                        <Link href="/client-portal" className="navbar-mobile-link text-gold">
                            Client Login
                        </Link>
                    </li>
                </ul>
            </div>
        </header>
    );
}