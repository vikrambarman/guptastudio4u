// components/erp/admin/MediaGrid.tsx
"use client";

import { useState } from "react";

interface MediaItem {
  _id: string;
  mediaId: string;
  originalName: string;
  fileType: "photo" | "video" | "reel";
  previewUrl: string | null;
  isPublic: boolean;
}

interface MediaGridProps {
  eventId: string;
  media: MediaItem[];
  onRefresh: () => void;
}

export default function MediaGrid({ eventId, media, onRefresh }: MediaGridProps) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const [lazyUrls, setLazyUrls] = useState<Record<string, string>>({});

  const handleDelete = async (mediaId: string) => {
    if (!confirm("Ye media delete karna hai? Ye action wapas nahi ho sakta.")) return;
    setBusyId(mediaId);
    try {
      const res = await fetch(`/api/events/${eventId}/media?mediaId=${mediaId}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) onRefresh();
      else alert(result.error || "Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  const handleTogglePublic = async (mediaId: string, current: boolean) => {
    setBusyId(mediaId);
    try {
      const res = await fetch(`/api/events/${eventId}/media`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaId, isPublic: !current }),
      });
      const result = await res.json();
      if (result.success) onRefresh();
      else alert(result.error || "Update failed");
    } finally {
      setBusyId(null);
    }
  };

  const handlePreviewVideo = async (mediaId: string) => {
    if (lazyUrls[mediaId]) {
      setPreviewingId(mediaId);
      return;
    }
    setBusyId(mediaId);
    try {
      const res = await fetch(`/api/download/${mediaId}`);
      const result = await res.json();
      if (result.success) {
        setLazyUrls((prev) => ({ ...prev, [mediaId]: result.data.url }));
        setPreviewingId(mediaId);
      } else {
        alert(result.error || "Preview failed");
      }
    } finally {
      setBusyId(null);
    }
  };

  if (media.length === 0) {
    return (
      <div className="p-8 text-center text-muted">
        Abhi tak koi media upload nahi hui hai.
      </div>
    );
  }

  return (
    <>
      <div className="media-grid">
        {media.map((item) => (
          <div key={item._id} className="media-item">
            {item.fileType === "photo" && item.previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.previewUrl} alt={item.originalName} />
            ) : (
              <div
                className="flex items-center justify-center w-full h-full"
                style={{ background: "var(--color-black-soft)", cursor: "pointer" }}
                onClick={() => handlePreviewVideo(item.mediaId)}
              >
                <span style={{ fontSize: "32px" }}>
                  {busyId === item.mediaId ? (
                    <span className="loader" />
                  ) : item.fileType === "video" ? (
                    "🎥"
                  ) : (
                    "🎬"
                  )}
                </span>
              </div>
            )}
            <span className="media-item-type">{item.fileType.toUpperCase()}</span>

            <button
              type="button"
              className="btn btn-danger btn-icon btn-sm"
              style={{ position: "absolute", top: "8px", left: "8px" }}
              onClick={() => handleDelete(item.mediaId)}
              disabled={busyId === item.mediaId}
              title="Delete"
            >
              🗑️
            </button>

            {item.fileType === "photo" && (
              <button
                type="button"
                className={`badge ${item.isPublic ? "badge-gold" : "badge-gray"}`}
                style={{
                  position: "absolute",
                  bottom: "8px",
                  right: "8px",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => handleTogglePublic(item.mediaId, item.isPublic)}
                disabled={busyId === item.mediaId}
                title={item.isPublic ? "Public Gallery se hatayein" : "Public Gallery me dikhayein"}
              >
                {item.isPublic ? "🌐 Public" : "🔒 Private"}
              </button>
            )}
          </div>
        ))}
      </div>

      {previewingId && lazyUrls[previewingId] && (
        <div className="modal-backdrop" onClick={() => setPreviewingId(null)}>
          <div className="modal" style={{ maxWidth: "720px" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title text-gold">Preview</span>
              <button className="modal-close" onClick={() => setPreviewingId(null)}>×</button>
            </div>
            <div className="modal-body">
              <video
                src={lazyUrls[previewingId]}
                controls
                autoPlay
                style={{ width: "100%", borderRadius: "var(--radius-lg)" }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}