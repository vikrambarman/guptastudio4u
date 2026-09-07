// components/erp/client/ClientEventCard.tsx
import Link from "next/link";

interface ClientEventCardProps {
  eventId: string;
  title: string;
  eventType: string;
  eventDate: string;
  venue: string;
  status: string;
  totalPhotos: number;
  totalVideos: number;
}

const STATUS_BADGE: Record<string, string> = {
  upcoming: "badge-info",
  ongoing: "badge-warning",
  completed: "badge-success",
  delivered: "badge-gold",
};

export default function ClientEventCard({
  eventId,
  title,
  eventType,
  eventDate,
  venue,
  status,
  totalPhotos,
  totalVideos,
}: ClientEventCardProps) {
  return (
    <Link
      href={`/client/my-events/${eventId}`}
      className="card card-hover"
      style={{ display: "block" }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-gold font-bold">{eventId}</span>
        <span className={`badge ${STATUS_BADGE[status] || "badge-gray"}`}>
          {status}
        </span>
      </div>
      <h3 className="text-white mb-2">{title}</h3>
      <p className="text-sm text-muted mb-1 uppercase">{eventType}</p>
      <p className="text-sm text-muted mb-4">
        📍 {venue} • 📅 {new Date(eventDate).toLocaleDateString("en-IN")}
      </p>
      <div className="flex gap-4 text-sm text-muted">
        <span>📷 {totalPhotos} Photos</span>
        <span>🎥 {totalVideos} Videos</span>
      </div>
    </Link>
  );
}