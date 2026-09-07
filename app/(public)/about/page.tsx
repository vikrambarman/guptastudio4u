// app/(public)/about/page.tsx
import type { Metadata } from "next";
import SectionHeading from "@/components/public/SectionHeading";
import { STUDIO_CONFIG } from "@/lib/config/studio";

export const metadata: Metadata = {
    title: "About Us",
    description: `${STUDIO_CONFIG.name} ke baare me jaanein — hamari services, experience aur commitment.`,
};

export default function AboutPage() {
    return (
        <div className="public-page section">
            <div className="container container-md">
                <SectionHeading
                    label="About Us"
                    title={`Welcome to ${STUDIO_CONFIG.name}`}
                    description="Har pal ko yaadgar banane ka junoon"
                />

                <div className="flex flex-col gap-6">
                    <p className="text-white-soft" style={{ lineHeight: "var(--lh-relaxed)" }}>
                        {STUDIO_CONFIG.name} ek professional photography aur event
                        services studio hai jo Ambikapur aur aas-paas ke ilake me apni
                        quality aur trust ke liye jaana jaata hai. Hum shadi, birthday,
                        corporate events se lekar decoration, printing aur DJ setup tak —
                        har zaroorat ko ek hi chhat ke neeche poora karte hain.
                    </p>
                    <p className="text-white-soft" style={{ lineHeight: "var(--lh-relaxed)" }}>
                        Hamari team experienced photographers, videographers aur event
                        specialists ki hai jo aapke khaas pal ko professional andaaz me
                        capture karte hain — aur hamare digital Client Portal ke through,
                        aap apni photos aur videos kabhi bhi, kahin bhi dekh aur download
                        kar sakte hain.
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-6 mt-12">
                    <div className="card text-center">
                        <div style={{ fontSize: "32px" }} className="mb-4">📸</div>
                        <h4 className="text-white mb-2">Quality First</h4>
                        <p className="text-sm text-muted">
                            Har shot, har frame me professional quality ka poora khayal.
                        </p>
                    </div>
                    <div className="card text-center">
                        <div style={{ fontSize: "32px" }} className="mb-4">⏱️</div>
                        <h4 className="text-white mb-2">On-Time Delivery</h4>
                        <p className="text-sm text-muted">
                            Aapke event ki photos/videos time pe delivered.
                        </p>
                    </div>
                    <div className="card text-center">
                        <div style={{ fontSize: "32px" }} className="mb-4">🔒</div>
                        <h4 className="text-white mb-2">Secure Client Portal</h4>
                        <p className="text-sm text-muted">
                            Apni private photos sirf apne Client ID se access karein.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}