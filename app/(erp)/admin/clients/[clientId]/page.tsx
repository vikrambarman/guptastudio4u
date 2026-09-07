// app/(erp)/admin/clients/[clientId]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import connectDB from "@/lib/db/mongodb";
import Client from "@/lib/db/models/Client";
import Event from "@/lib/db/models/Event";
import ClientDetailActions from "@/components/erp/admin/ClientDetailActions";

interface PageProps {
    params: Promise<{ clientId: string }>;
}

export default async function ClientDetailPage({ params }: PageProps) {
    const { clientId } = await params;
    await connectDB();

    const client = await Client.findOne({ clientId: clientId.toUpperCase() })
        .select("-password -plainPassword")
        .lean();

    if (!client) notFound();

    const events = await Event.find({ clientId: client._id })
        .sort({ eventDate: -1 })
        .lean();

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-gold">{client.name}</h1>
                    <span
                        className="client-id-badge mt-2"
                        style={{ display: "inline-block" }}
                    >
                        {client.clientId}
                    </span>
                </div>
                <Link href="/admin/clients" className="btn btn-dark btn-sm">
                    ← Back to Clients
                </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="card">
                    <div className="text-sm text-muted mb-1">Phone</div>
                    <div className="text-white font-medium">{client.phone}</div>
                </div>
                <div className="card">
                    <div className="text-sm text-muted mb-1">Email</div>
                    <div className="text-white font-medium">{client.email || "—"}</div>
                </div>
                <div className="card">
                    <div className="text-sm text-muted mb-1">Status</div>
                    <span
                        className={`badge ${client.isActive ? "badge-success" : "badge-error"}`}
                    >
                        {client.isActive ? "Active" : "Inactive"}
                    </span>
                </div>
            </div>

            <ClientDetailActions
                clientId={client.clientId}
                name={client.name}
                phone={client.phone}
                isActive={client.isActive}
            />

            <div className="table-container mt-8">
                <div className="table-header">
                    <span className="table-title">Events ({events.length})</span>
                    <Link
                        href={`/admin/events/new?clientId=${client.clientId}`}
                        className="btn btn-gold btn-sm"
                    >
                        + Create Event
                    </Link>
                </div>

                {events.length === 0 ? (
                    <div className="p-8 text-center text-muted">
                        Is client ka koi event nahi bana hai abhi tak.
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Event ID</th>
                                <th>Title</th>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event._id.toString()}>
                                    <td className="text-gold">{event.eventId}</td>
                                    <td>{event.title}</td>
                                    <td className="uppercase text-xs">{event.eventType}</td>
                                    <td>
                                        {new Date(event.eventDate).toLocaleDateString("en-IN")}
                                    </td>
                                    <td>
                                        <span className="badge badge-info">{event.status}</span>
                                    </td>
                                    <td>
                                        <Link
                                            href={`/admin/events/${event.eventId}`}
                                            className="btn btn-ghost btn-sm"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}