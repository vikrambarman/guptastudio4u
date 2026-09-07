// app/(erp)/client/my-events/page.tsx
import { redirect } from "next/navigation";
import connectDB from "@/lib/db/mongodb";
import { getClientSession } from "@/lib/auth/getClientSession";
import { getEventsList } from "@/lib/db/queries/eventQueries";
import ClientEventCard from "@/components/erp/client/ClientEventCard";

export default async function MyEventsPage() {
  const client = await getClientSession();
  if (!client) redirect("/client-portal");

  await connectDB();
  const { events } = await getEventsList({
    clientDbId: client.clientDbId,
    limit: 100,
  });

  return (
    <div>
      <h1 className="text-gold mb-6">My Events</h1>

      {events.length === 0 ? (
        <div className="card text-center" style={{ padding: "var(--space-8)" }}>
          <p className="text-muted">
            Abhi tak aapka koi event register nahi hua hai. Studio se contact
            karein.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {events.map((event) => (
            <ClientEventCard
              key={event.eventId}
              eventId={event.eventId}
              title={event.title}
              eventType={event.eventType}
              eventDate={event.eventDate.toString()}
              venue={event.venue}
              status={event.status}
              totalPhotos={event.totalPhotos}
              totalVideos={event.totalVideos}
            />
          ))}
        </div>
      )}
    </div>
  );
}