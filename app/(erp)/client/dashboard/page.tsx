// app/(erp)/client/dashboard/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db/mongodb";
import { getClientSession } from "@/lib/auth/getClientSession";
import { getEventsList } from "@/lib/db/queries/eventQueries";

export default async function ClientDashboardPage() {
  const client = await getClientSession();
  if (!client) redirect("/client-portal");

  await connectDB();
  const { events } = await getEventsList({
    clientDbId: client.clientDbId,
    limit: 5,
  });

  return (
    <div>
      <h1 className="text-gold">Welcome, {client.name}!</h1>
      <p className="text-muted mt-4">Client ID: {client.clientId}</p>
      <p className="text-muted mb-8">Phone: {client.phone}</p>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white">Recent Events</h3>
        <Link href="/client/my-events" className="btn btn-gold btn-sm">
          View All Events
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="card text-center" style={{ padding: "var(--space-8)" }}>
          <p className="text-muted">
            Abhi tak koi event register nahi hua hai.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {events.map((event) => (
            <Link
              key={event.eventId}
              href={`/client/my-events/${event.eventId}`}
              className="card card-hover"
              style={{ display: "block" }}
            >
              <span className="text-gold font-bold">{event.eventId}</span>
              <h4 className="text-white mt-2">{event.title}</h4>
              <p className="text-sm text-muted mt-1">
                {new Date(event.eventDate).toLocaleDateString("en-IN")}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}