// app/(erp)/admin/events/page.tsx
import Link from "next/link";
import connectDB from "@/lib/db/mongodb";
import { getEventsList } from "@/lib/db/queries/eventQueries";
import EventTable from "@/components/erp/admin/EventTable";

interface PageProps {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}

export default async function EventsListPage({ searchParams }: PageProps) {
  const { search = "", status = "", page = "1" } = await searchParams;
  const currentPage = parseInt(page, 10) || 1;

  await connectDB();
  const { events, total, totalPages } = await getEventsList({
    search,
    status,
    page: currentPage,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-gold">Events</h1>
          <p className="text-muted text-sm mt-1">
            Total {total} event{total !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/admin/events/new" className="btn btn-gold">
          + Create Event
        </Link>
      </div>

      <EventTable
        events={JSON.parse(JSON.stringify(events))}
        search={search}
        status={status}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}