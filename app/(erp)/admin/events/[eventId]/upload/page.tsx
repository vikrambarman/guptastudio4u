// app/(erp)/admin/events/[eventId]/upload/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import MediaUploader from "@/components/erp/admin/MediaUploader";
import MediaGrid from "@/components/erp/admin/MediaGrid";

interface MediaItem {
    _id: string;
    mediaId: string;
    originalName: string;
    fileType: "photo" | "video" | "reel";
    previewUrl: string | null;
    isPublic: boolean;   // ✅ NEW
}

export default function EventUploadPage() {
    const params = useParams<{ eventId: string }>();
    const eventId = params.eventId;

    const [media, setMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMedia = useCallback(async () => {
        const res = await fetch(`/api/events/${eventId}/media`);
        const result = await res.json();
        if (result.success) setMedia(result.data);
        setLoading(false);
    }, [eventId]);

    useEffect(() => {
        fetchMedia();
    }, [fetchMedia]);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-gold">Upload Media</h1>
                    <p className="text-muted text-sm mt-1">Event: {eventId}</p>
                </div>
                <Link
                    href={`/admin/events/${eventId}`}
                    className="btn btn-dark btn-sm"
                >
                    ← Back to Event
                </Link>
            </div>

            <MediaUploader eventId={eventId} onUploaded={fetchMedia} />

            <div className="table-container mt-8">
                <div className="table-header">
                    <span className="table-title">Uploaded Media ({media.length})</span>
                </div>
                {loading ? (
                    <div className="p-8 text-center">
                        <span className="loader loader-lg" />
                    </div>
                ) : (
                    <div style={{ padding: "var(--space-6)" }}>
                        <MediaGrid eventId={eventId} media={media} onRefresh={fetchMedia} />
                    </div>
                )}
            </div>
        </div>
    );
}