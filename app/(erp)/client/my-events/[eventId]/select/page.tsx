// app/(erp)/client/my-events/[eventId]/select/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ClientMediaGrid from "@/components/erp/client/ClientMediaGrid";
import DownloadCart from "@/components/erp/client/DownloadCart";
import PaymentQRCard from "@/components/shared/PaymentQRCard";

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
  permissions: {
    downloadEnabled: boolean;
    paymentRequired: boolean;
    paymentAmount: number;
    paymentNote?: string;
    paymentStatus: "pending" | "received" | "not_required";
  };
}

export default function SelectMediaPage() {
  const params = useParams<{ eventId: string }>();
  const router = useRouter();
  const eventId = params.eventId;

  const [event, setEvent] = useState<EventData | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const fetchData = useCallback(async () => {
    const [eventRes, mediaRes] = await Promise.all([
      fetch(`/api/clients/events/${eventId}`),
      fetch(`/api/clients/events/${eventId}/media`),
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

  const toggleSelect = (mediaId: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(mediaId)) next.delete(mediaId);
      else next.add(mediaId);
      return next;
    });
  };

  const canDownload =
    !!event?.permissions.downloadEnabled &&
    (!event.permissions.paymentRequired ||
      event.permissions.paymentStatus === "received");

  const handleBulkDownload = async () => {
    if (!canDownload) return;
    setDownloading(true);
    try {
      for (const mediaId of selected) {
        const res = await fetch(`/api/download/${mediaId}`);
        const result = await res.json();
        if (result.success) {
          const link = document.createElement("a");
          link.href = result.data.url;
          link.download = "";
          document.body.appendChild(link);
          link.click();
          link.remove();
          // Browser ko sequential downloads sambhalne ke liye chhota gap
          await new Promise((resolve) => setTimeout(resolve, 500));
        } else {
          alert(`Download failed: ${result.error}`);
        }
      }
    } finally {
      setDownloading(false);
    }
  };

  if (loading || !event) {
    return (
      <div className="p-8 text-center">
        <span className="loader loader-lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-gold">{event.title}</h1>
          <p className="text-muted text-sm mt-1">
            Photos/Videos select karein
          </p>
        </div>
        <Link
          href={`/client/my-events/${eventId}`}
          className="btn btn-dark btn-sm"
        >
          ← Back
        </Link>
      </div>

      {!canDownload && event.permissions.paymentRequired && (
        <div className="mb-8">
          <PaymentQRCard
            amount={event.permissions.paymentAmount}
            note={event.permissions.paymentNote}
          />
        </div>
      )}

      {!event.permissions.downloadEnabled && !event.permissions.paymentRequired && (
        <div className="payment-pending-banner mb-6">
          <span>🔒</span>
          <span className="text-sm">
            Download abhi enable nahi hua hai. Studio se contact karein.
          </span>
        </div>
      )}

      <div className="table-container">
        <div className="table-header">
          <span className="table-title">Select Media ({media.length})</span>
        </div>
        <div style={{ padding: "var(--space-6)" }}>
          <ClientMediaGrid
            media={media}
            selectable
            selected={selected}
            onToggle={toggleSelect}
            downloadEnabled={canDownload}
          />
        </div>
      </div>

      <DownloadCart
        count={selected.size}
        downloading={downloading}
        canDownload={canDownload}
        onDownload={handleBulkDownload}
        onClear={() => setSelected(new Set())}
      />
    </div>
  );
}