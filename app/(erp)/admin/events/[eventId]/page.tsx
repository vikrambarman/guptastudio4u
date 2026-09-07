// app/(erp)/admin/events/[eventId]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import connectDB from "@/lib/db/mongodb";
import { getEventDetail } from "@/lib/db/queries/eventQueries";
import EventStatusUpdater from "@/components/erp/admin/EventStatusUpdater";
import QRDisplay from "@/components/shared/QRDisplay";
import type { EventStatus } from "@/lib/db/models/Event";
import PermissionPanel from "@/components/erp/admin/PermissionPanel";

interface PageProps {
    params: Promise<{ eventId: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
    const { eventId } = await params;
    await connectDB();

    const event = await getEventDetail(eventId);
    if (!event) notFound();

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
                <Link href="/admin/events" className="btn btn-dark btn-sm">
                    ← Back to Events
                </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="card">
                    <div className="text-sm text-muted mb-1">Client</div>
                    <Link
                        href={`/admin/clients/${event.clientCode}`}
                        className="text-gold font-medium"
                    >
                        {event.clientName}
                    </Link>
                    <div className="text-xs text-muted mt-1">{event.clientCode}</div>
                </div>
                <div className="card">
                    <div className="text-sm text-muted mb-1">Event Date</div>
                    <div className="text-white font-medium">
                        {new Date(event.eventDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </div>
                </div>
                <div className="card">
                    <div className="text-sm text-muted mb-1">Venue</div>
                    <div className="text-white font-medium">{event.venue}</div>
                </div>
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

            <div className="grid grid-cols-2 gap-6">
                <div className="card">
                    <div className="section-label">Event Status</div>
                    <EventStatusUpdater
                        eventId={event.eventId}
                        currentStatus={event.status as EventStatus}
                    />

                    {event.description && (
                        <>
                            <div className="section-label mt-6">Description</div>
                            <p className="text-sm text-muted">{event.description}</p>
                        </>
                    )}

                    {event.packageDetails?.name && (
                        <>
                            <div className="section-label mt-6">Package</div>
                            <div className="text-white font-medium">
                                {event.packageDetails.name} — ₹{event.packageDetails.price}
                            </div>
                            <ul className="mt-3 flex flex-col gap-2">
                                {event.packageDetails.includes?.map((item: string) => (
                                    <li key={item} className="service-feature">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                    <div className="mt-8 flex gap-3">
                        <Link
                            href={`/admin/events/${event.eventId}/upload`}
                            className="btn btn-gold btn-sm"
                        >
                            📤 Upload Media
                        </Link>
                    </div>
                </div>

                <div className="card text-center">
                    <div className="section-label" style={{ justifyContent: "center" }}>
                        Client Access QR
                    </div>
                    <p className="text-sm text-muted mb-4">
                        Ye wahi universal QR hai — client isse scan karke login page pe
                        pahunchega
                    </p>
                    <QRDisplay
                        value={event.qrCode}
                        label="Apni photos/videos dekhne ke liye scan karein"
                    />
                </div>
            </div>

      // ✅ Iski jagah ye lagao:
            <div className="mt-6">
                <div className="section-label">Download Permissions</div>
                <PermissionPanel eventId={event.eventId} permissions={event.permissions} />
            </div>
        </div>
    );
}