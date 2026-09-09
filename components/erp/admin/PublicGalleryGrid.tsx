// components/erp/admin/PublicGalleryGrid.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface GalleryMediaItem {
    _id: string;
    mediaId: string;
    originalName: string;
    fileType: "photo" | "video" | "reel";
    previewUrl: string | null;
    isPublic: boolean;
    eventCode: string;
    eventTitle: string;
}

export default function PublicGalleryGrid({
    media,
}: {
    media: GalleryMediaItem[];
}) {
    const router = useRouter();
    const [busyId, setBusyId] = useState<string | null>(null);

    const handleRemoveFromPublic = async (mediaId: string) => {
        if (!confirm("Is photo ko public gallery se hatana hai?")) return;
        setBusyId(mediaId);
        try {
            const res = await fetch("/api/media", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mediaId, isPublic: false }),
            });
            const result = await res.json();
            if (result.success) {
                router.refresh();
            } else {
                alert(result.error || "Update failed");
            }
        } finally {
            setBusyId(null);
        }
    };

    if (media.length === 0) {
        return (
            <div className="p-8 text-center text-muted">
                Abhi koi photo public gallery me nahi hai. Kisi event ke media page
                se photos ko &quot;🌐 Public&quot; mark karein.
            </div>
        );
    }

    return (
        <div className="media-grid">
            {media.map((item) => (
                <div key={item._id} className="media-item">
                    {item.previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.previewUrl} alt={item.originalName} />
                    ) : (
                        <div
                            className="flex items-center justify-center w-full h-full"
                            style={{ background: "var(--color-black-soft)" }}
                        >
                            <span style={{ fontSize: "28px" }}>
                                {item.fileType === "video" ? "🎥" : "🎬"}
                            </span>
                        </div>
                    )}

                    <span className="media-item-type">
                        {item.fileType.toUpperCase()}
                    </span>

                    <Link
                        href={`/admin/events/${item.eventCode}`}
                        className="badge badge-info"
                        style={{
                            position: "absolute",
                            top: "8px",
                            left: "8px",
                            textDecoration: "none",
                        }}
                        title={item.eventTitle}
                    >
                        {item.eventCode}
                    </Link>

                    <button
                        type="button"
                        className="badge badge-gold"
                        style={{
                            position: "absolute",
                            bottom: "8px",
                            right: "8px",
                            border: "none",
                            cursor: "pointer",
                        }}
                        onClick={() => handleRemoveFromPublic(item.mediaId)}
                        disabled={busyId === item.mediaId}
                        title="Public gallery se hatayein"
                    >
                        {busyId === item.mediaId ? (
                            <span className="loader" />
                        ) : (
                            "🌐 Remove"
                        )}
                    </button>
                </div>
            ))}
        </div>
    );
}