// app/(erp)/client/my-events/[eventId]/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ClientMediaGrid from "@/components/erp/client/ClientMediaGrid";

interface MediaItem {
  _id: string;
  mediaId: string;
  originalName: string;
  fileType: "photo" | "video" | "reel";
  previewUrl: string | null;
}

interface EventData {
  eventId: string;
  title: string;
  totalPhotos: number;
  totalVideos: number;
  totalReels: number;
  permissions: {
    downloadEnabled: boolean;
    paymentRequired: boolean;
    paymentStatus: "pending" | "received" | "not_required";
    paymentNote?: string;
  };
}

export default function ClientEventDetailPage() {
  const params = useParams<{ eventId: string }>();
  const router = useRouter();
  const eventId = params.eventId;

  const [event, setEvent] = useState<EventData | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const [eventRes, mediaRes] = await Promise.all([
      fetch(`/api/client/events/${eventId}`),
      fetch(`/api/client/events/${eventId}/media`),
    ]);
    const eventJson = await eventRes.json();
    const mediaJson = await mediaRes.json();

    if (!eventJson.success) {
      router.push("/client/my-events");
      return;
    }

    setEvent(eventJson.data);
    if (mediaJson.success) setMedia(mediaJson.data);
    setLoading(false);
  }, [eventId, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading || !event) {
    return (
      <div className="p-8 text-center">
        <span className="loader loader-lg" />
      </div>
    );
  }

  const canDownload =
    event.permissions.downloadEnabled &&
    (!event.permissions.paymentRequired ||
      event.permissions.paymentStatus === "received");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-gold">{event.title}</h1>
          <span
            className="client-id-badge mt-2"
            style={{ display: "inline-block" }}
          >
            {event.eventId}
          </span>
        </div>
        <Link href="/client/my-events" className="btn btn-dark btn-sm">
          ← Back
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="stat-card">
          <div className="stat-card-icon">📷</div>
          <div className="stat-card-value">{event.totalPhotos}</div>
          <div className="stat-card-label">Photos</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">🎥</div>
          <div className="stat-card-value">{event.totalVideos}</div>
          <div className="stat-card-label">Videos</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">🎬</div>
          <div className="stat-card-value">{event.totalReels}</div>
          <div className="stat-card-label">Reels</div>
        </div>
      </div>

      {!event.permissions.downloadEnabled && (
        <div className="payment-pending-banner">
          <span>🔒</span>
          <span className="text-sm">
            Download abhi enable nahi hua hai. Studio isse jald enable karega.
          </span>
        </div>
      )}
      {event.permissions.downloadEnabled &&
        event.permissions.paymentRequired &&
        event.permissions.paymentStatus !== "received" && (
          <div className="payment-pending-banner">
            <span>⏳</span>
            <span className="text-sm">
              {event.permissions.paymentNote ||
                "Payment complete karein download ke liye"}
            </span>
          </div>
        )}
      {canDownload && (
        <div className="payment-received-banner">
          <span>✅</span>
          <span className="text-sm">
            Download available hai! Photos/videos select karke download
            karein.
          </span>
        </div>
      )}

      <div className="flex justify-end mt-6 mb-4">
        <Link
          href={`/client/my-events/${event.eventId}/select`}
          className="btn btn-gold"
        >
          📥 Photos/Videos Select Karein
        </Link>
      </div>

      <div className="table-container">
        <div className="table-header">
          <span className="table-title">All Media ({media.length})</span>
        </div>
        <div style={{ padding: "var(--space-6)" }}>
          <ClientMediaGrid media={media} downloadEnabled={canDownload} />
        </div>
      </div>
    </div>
  );
}