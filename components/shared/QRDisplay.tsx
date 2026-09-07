// components/shared/QRDisplay.tsx
"use client";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { STUDIO_CONFIG } from "@/lib/config/studio";

interface QRDisplayProps {
    value: string;
    size?: number;
    label?: string;
}

export default function QRDisplay({ value, size = 220, label }: QRDisplayProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleDownload = () => {
        const canvas = wrapperRef.current?.querySelector("canvas");
        if (!canvas) return;
        const url = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = url;
        link.download = "gupta-studio-4u-scan-qr.png";
        link.click();
    };

    return (
        <div>
            <div className="qr-container" ref={wrapperRef}>
                <QRCodeCanvas
                    value={value}
                    size={size}
                    level="H"
                    bgColor="#FFFFFF"
                    fgColor="#0a0a0a"
                />
                <div className="qr-logo-area">
                    <div className="qr-studio-name">{STUDIO_CONFIG.name}</div>
                    <div className="qr-scan-hint mt-2">
                        {label || "Scan karke apni photos/videos dekhein"}
                    </div>
                </div>
            </div>

            <div className="flex gap-3 mt-4 no-print">
                <button className="btn btn-outline btn-sm" onClick={handleDownload}>
                    ⬇️ Download PNG
                </button>
                <button className="btn btn-gold btn-sm" onClick={() => window.print()}>
                    🖨️ Print QR Card
                </button>
            </div>
        </div>
    );
}