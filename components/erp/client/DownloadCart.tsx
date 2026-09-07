// components/erp/client/DownloadCart.tsx
"use client";

interface DownloadCartProps {
  count: number;
  downloading: boolean;
  canDownload: boolean;
  onDownload: () => void;
  onClear: () => void;
}

export default function DownloadCart({
  count,
  downloading,
  canDownload,
  onDownload,
  onClear,
}: DownloadCartProps) {
  if (count === 0) return null;

  return (
    <div className="download-cart">
      <div>
        <div className="download-cart-count">{count}</div>
        <div className="text-xs text-muted">Selected</div>
      </div>
      <button
        className="btn btn-dark btn-sm"
        onClick={onClear}
        disabled={downloading}
      >
        Clear
      </button>
      <button
        className="btn btn-gold btn-sm"
        onClick={onDownload}
        disabled={downloading || !canDownload}
      >
        {downloading ? (
          <span className="loader" />
        ) : canDownload ? (
          "⬇️ Download"
        ) : (
          "🔒 Locked"
        )}
      </button>
    </div>
  );
}