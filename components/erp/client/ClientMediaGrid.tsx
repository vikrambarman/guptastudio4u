// components/erp/client/ClientMediaGrid.tsx
"use client";

import { useState } from "react";

interface MediaItem {
  _id: string;
  mediaId: string;
  originalName: string;
  fileType: "photo" | "video" | "reel";
  previewUrl: string | null;
}

interface ClientMediaGridProps {
  media: MediaItem[];
  selectable?: boolean;
  selected?: Set<string>;
  onToggle?: (mediaId: string) => void;
  downloadEnabled: boolean;
}

export default function ClientMediaGrid({
  media,
  selectable = false,
  selected = new Set(),
  onToggle,
  downloadEnabled,
}: ClientMediaGridProps) {
  const [preview, setPreview] = useState<{
    url: string;
    type: "photo" | "video";
  } | null>(null);
  const [previewLoading, setPreviewLoading] = useState<string | null>(null);

  const handleVideoPreview = async (e: React.MouseEvent, item: MediaItem) => {
    e.stopPropagation();
    if (!downloadEnabled) {
      alert("Payment complete hone ke baad hi preview available hoga.");
      return;
    }
    setPreviewLoading(item.mediaId);
    try {
      const res = await fetch(`/api/download/${item.mediaId}`);
      const result = await res.json();
      if (result.success) {
        setPreview({ url: result.data.url, type: "video" });
      } else {
        alert(result.error);
      }
    } finally {
      setPreviewLoading(null);
    }
  };

  const handleTileClick = (item: MediaItem) => {
    if (selectable && onToggle) {
      onToggle(item.mediaId);
    } else if (item.fileType === "photo" && item.previewUrl) {
      setPreview({ url: item.previewUrl, type: "photo" });
    }
  };

  if (media.length === 0) {
    return (
      <div className="p-8 text-center text-muted">
        Is event ke liye abhi koi photos/videos upload nahi hui hain.
      </div>
    );
  }

  return (
    <>
      <div className="media-grid">
        {media.map((item) => {
          const isSelected = selected.has(item.mediaId);
          return (
            <div
              key={item._id}
              className={`media-item ${isSelected ? "selected" : ""}`}
              onClick={() => handleTileClick(item)}
            >
              {item.fileType === "photo" && item.previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.previewUrl} alt={item.originalName} />
              ) : (
                <div
                  className="flex items-center justify-center w-full h-full"
                  style={{ background: "var(--color-black-soft)" }}
                  onClick={(e) =>
                    !selectable ? handleVideoPreview(e, item) : undefined
                  }
                >
                  <span style={{ fontSize: "32px" }}>
                    {previewLoading === item.mediaId ? (
                      <span className="loader" />
                    ) : item.fileType === "video" ? (
                      "🎥"
                    ) : (
                      "🎬"
                    )}
                  </span>
                </div>
              )}
              <span className="media-item-type">
                {item.fileType.toUpperCase()}
              </span>
              {selectable && <div className="media-item-check">✓</div>}
            </div>
          );
        })}
      </div>

      {preview && (
        <div className="modal-backdrop" onClick={() => setPreview(null)}>
          <div
            className="modal"
            style={{ maxWidth: "720px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <span className="modal-title text-gold">Preview</span>
              <button className="modal-close" onClick={() => setPreview(null)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              {preview.type === "video" ? (
                <video
                  src={preview.url}
                  controls
                  autoPlay
                  style={{ width: "100%", borderRadius: "var(--radius-lg)" }}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview.url}
                  alt="Preview"
                  style={{ width: "100%", borderRadius: "var(--radius-lg)" }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}