// components/erp/admin/EventTable.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface EventRow {
  _id: string;
  eventId: string;
  title: string;
  eventType: string;
  eventDate: string;
  venue: string;
  status: string;
  clientCode: string;
  clientName: string;
}

const STATUS_BADGE: Record<string, string> = {
  upcoming: "badge-info",
  ongoing: "badge-warning",
  completed: "badge-success",
  delivered: "badge-gold",
};

export default function EventTable({
  events,
  search,
  status,
  currentPage,
  totalPages,
}: {
  events: EventRow[];
  search: string;
  status: string;
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(search);

  const applyFilters = (overrides: Record<string, string> = {}) => {
    const params = new URLSearchParams();
    const newSearch = overrides.search ?? searchInput;
    const newStatus = overrides.status ?? status;
    if (newSearch.trim()) params.set("search", newSearch.trim());
    if (newStatus) params.set("status", newStatus);
    router.push(`/admin/events?${params.toString()}`);
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    params.set("page", String(page));
    router.push(`/admin/events?${params.toString()}`);
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <span className="table-title">All Events</span>
        <div className="flex gap-2">
          <select
            className="form-input form-select"
            value={status}
            onChange={(e) => applyFilters({ status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="delivered">Delivered</option>
          </select>
          <input
            type="text"
            className="form-input"
            placeholder="Search title, ID or venue..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            style={{ minWidth: "220px" }}
          />
          <button className="btn btn-dark btn-sm" onClick={() => applyFilters()}>
            Search
          </button>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="p-8 text-center text-muted">
          Koi event nahi mila.{" "}
          <Link href="/admin/events/new" className="text-gold">
            Naya event banayein
          </Link>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Event ID</th>
              <th>Title</th>
              <th>Client</th>
              <th>Type</th>
              <th>Date</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id}>
                <td className="text-gold font-medium">{event.eventId}</td>
                <td>{event.title}</td>
                <td>
                  <div className="text-sm">{event.clientName}</div>
                  <div className="text-xs text-muted">{event.clientCode}</div>
                </td>
                <td className="uppercase text-xs">{event.eventType}</td>
                <td>{new Date(event.eventDate).toLocaleDateString("en-IN")}</td>
                <td>
                  <span
                    className={`badge ${STATUS_BADGE[event.status] || "badge-gray"}`}
                  >
                    {event.status}
                  </span>
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

      {totalPages > 1 && (
        <div
          className="flex items-center justify-between p-4"
          style={{ borderTop: "1px solid var(--color-black-border)" }}
        >
          <span className="text-sm text-muted">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              className="btn btn-dark btn-sm"
              disabled={currentPage <= 1}
              onClick={() => goToPage(currentPage - 1)}
            >
              Previous
            </button>
            <button
              className="btn btn-dark btn-sm"
              disabled={currentPage >= totalPages}
              onClick={() => goToPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}