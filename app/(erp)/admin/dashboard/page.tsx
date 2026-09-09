// app/(erp)/admin/dashboard/page.tsx
import Link from "next/link";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Client from "@/lib/db/models/Client";
import Event from "@/lib/db/models/Event";
import Order from "@/lib/db/models/Order";
import Media from "@/lib/db/models/Media";

// ── Types ─────────────────────────────────────────────────────
interface StatsData {
  totalClients: number;
  totalEvents: number;
  totalOrders: number;
  totalMedia: number;
  pendingOrders: number;
  activeEvents: number;
  // This month
  newClientsThisMonth: number;
  newEventsThisMonth: number;
}

interface RecentOrder {
  _id: string;
  orderId: string;
  clientName: string;
  eventTitle: string;
  total: number;
  status: string;
  createdAt: string;
}

interface RecentClient {
  _id: string;
  clientId: string;
  name: string;
  phone: string;
  eventsCount: number;
  createdAt: string;
}

interface UpcomingEvent {
  _id: string;
  eventId: string;
  title: string;
  clientName: string;
  clientCode: string;
  eventDate: string;
  status: string;
  daysUntil: number;
}

// ── Helpers ───────────────────────────────────────────────────
function daysUntilDate(date: Date): number {
  const diff = new Date(date).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateShort(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

// ── Data Fetcher ──────────────────────────────────────────────
async function getDashboardData() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalClients,
    totalEvents,
    totalOrders,
    totalMedia,
    pendingOrders,
    activeEvents,
    newClientsThisMonth,
    newEventsThisMonth,
    recentOrdersRaw,
    recentClientsRaw,
    upcomingEventsRaw,
  ] = await Promise.all([
    Client.countDocuments(),
    Event.countDocuments(),
    Order.countDocuments(),
    Media.countDocuments(),
    Order.countDocuments({ status: "pending" }),
    Event.countDocuments({ status: "ongoing" }),
    Client.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Event.countDocuments({ createdAt: { $gte: startOfMonth } }),

    // Recent 6 orders
    Order.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("clientId", "name clientId")
      .populate("eventId", "title eventId")
      .lean(),

    // Recent 5 clients
    Client.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),

    // Upcoming events - next 60 days
    Event.find({
      eventDate: { $gte: now },
      status: { $in: ["upcoming", "ongoing"] },
    })
      .sort({ eventDate: 1 })
      .limit(5)
      .populate("clientId", "name clientId")
      .lean(),
  ]);

  // ── Format orders ──────────────────────────────────────────
  const recentOrders: RecentOrder[] = recentOrdersRaw.map((o: any) => ({
    _id: o._id.toString(),
    orderId: o.orderId,
    clientName: o.clientId?.name ?? "Unknown",
    eventTitle: o.eventId?.title ?? "N/A",
    total: o.total ?? o.amount ?? 0,
    status: o.status ?? "pending",
    createdAt: o.createdAt.toISOString(),
  }));

  // ── Format clients ─────────────────────────────────────────
  const recentClients: RecentClient[] = recentClientsRaw.map((c: any) => ({
    _id: c._id.toString(),
    clientId: c.clientId,
    name: c.name,
    phone: c.phone,
    eventsCount: c.events?.length ?? 0,
    createdAt: c.createdAt.toISOString(),
  }));

  // ── Format upcoming events ─────────────────────────────────
  const upcomingEvents: UpcomingEvent[] = upcomingEventsRaw.map((e: any) => ({
    _id: e._id.toString(),
    eventId: e.eventId,
    title: e.title,
    clientName: e.clientId?.name ?? "Unknown",
    clientCode: e.clientId?.clientId ?? "",
    eventDate: e.eventDate.toISOString(),
    status: e.status,
    daysUntil: daysUntilDate(e.eventDate),
  }));

  return {
    stats: {
      totalClients,
      totalEvents,
      totalOrders,
      totalMedia,
      pendingOrders,
      activeEvents,
      newClientsThisMonth,
      newEventsThisMonth,
    } as StatsData,
    recentOrders,
    recentClients,
    upcomingEvents,
  };
}

// ── Status Badge Config ───────────────────────────────────────
const orderStatusBadge: Record<string, string> = {
  pending: "badge badge-warning",
  confirmed: "badge badge-info",
  ready: "badge badge-gold",
  delivered: "badge badge-success",
  cancelled: "badge badge-error",
};

const eventStatusBadge: Record<string, string> = {
  active: "badge badge-success",
  scheduled: "badge badge-info",
  upcoming: "badge badge-info",
  completed: "badge badge-gray",
  cancelled: "badge badge-error",
};

// ── Page Component ────────────────────────────────────────────
export default async function AdminDashboardPage() {
  const session = await auth();
  await connectDB();
  const { stats, recentOrders, recentClients, upcomingEvents } =
    await getDashboardData();

  return (
    <div className="erp-content">

      {/* ── Page Heading ── */}
      <div className="flex items-center justify-between mb-6" style={{ flexWrap: "wrap", gap: "var(--space-4)" }}>
        <div>
          <p style={{
            fontFamily: "var(--font-accent)",
            fontSize: "var(--fs-xs)",
            letterSpacing: "var(--ls-widest)",
            textTransform: "uppercase",
            color: "var(--color-gold)",
            marginBottom: "var(--space-1)",
          }}>
            Admin Panel
          </p>
          <h1 style={{ fontSize: "clamp(var(--fs-2xl), 3vw, var(--fs-3xl))" }}>
            Welcome back,{" "}
            <span className="text-gold">{session?.user?.name?.split(" ")[0]}</span>!
          </h1>
          <p className="text-muted text-sm mt-4">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Quick action buttons - same pattern as other pages */}
        <div className="flex gap-3" style={{ flexWrap: "wrap" }}>
          <Link href="/admin/clients/new" className="btn btn-gold btn-sm">
            + New Client
          </Link>
          <Link href="/admin/events/new" className="btn btn-outline btn-sm">
            + New Event
          </Link>
          <Link href="/admin/payments" className="btn btn-dark btn-sm">
            💳 Payments
          </Link>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="stats-grid">

        <Link href="/admin/clients" style={{ textDecoration: "none" }}>
          <div className="stat-card">
            <div className="stat-card-icon">👥</div>
            <div className="stat-card-value">{stats.totalClients}</div>
            <div className="stat-card-label">Total Clients</div>
            <div className="stat-card-change up">
              ▲ {stats.newClientsThisMonth} this month
            </div>
          </div>
        </Link>

        <Link href="/admin/events" style={{ textDecoration: "none" }}>
          <div className="stat-card">
            <div className="stat-card-icon">📸</div>
            <div className="stat-card-value">{stats.totalEvents}</div>
            <div className="stat-card-label">Total Events</div>
            <div className="stat-card-change up">
              ▲ {stats.newEventsThisMonth} this month
            </div>
          </div>
        </Link>

        <Link href="/admin/orders" style={{ textDecoration: "none" }}>
          <div className="stat-card">
            <div className="stat-card-icon">🧾</div>
            <div className="stat-card-value">{stats.totalOrders}</div>
            <div className="stat-card-label">Total Orders</div>
            {stats.pendingOrders > 0 && (
              <div className="stat-card-change down">
                ⚠ {stats.pendingOrders} pending
              </div>
            )}
          </div>
        </Link>

        <Link href="/admin/events" style={{ textDecoration: "none" }}>
          <div className="stat-card">
            <div className="stat-card-icon">🎬</div>
            <div className="stat-card-value">{stats.activeEvents}</div>
            <div className="stat-card-label">Active Events</div>
            <div className="stat-card-change up">
              currently running
            </div>
          </div>
        </Link>

        <Link href="/admin/gallery" style={{ textDecoration: "none" }}>
          <div className="stat-card">
            <div className="stat-card-icon">🖼️</div>
            <div className="stat-card-value">
              {stats.totalMedia.toLocaleString("en-IN")}
            </div>
            <div className="stat-card-label">Total Media Files</div>
            <div className="stat-card-change" style={{ color: "var(--color-white-dim)" }}>
              photos + videos
            </div>
          </div>
        </Link>

      </div>
      {/* ── END Stats Grid ── */}

      {/* ── Main Two-Column Grid ── */}
      <div
        className="dashboard-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: "var(--space-6)",
          marginTop: "var(--space-6)",
        }}
      >
        {/* ── LEFT COLUMN ── */}
        <div className="flex flex-col gap-6">

          {/* Recent Orders Table */}
          <div className="table-container">
            <div className="table-header">
              <span className="table-title">Recent Orders</span>
              <Link href="/admin/orders" className="btn btn-ghost btn-sm">
                View All →
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-muted">
                Koi order nahi hai abhi tak 🧾
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Client</th>
                      <th>Event</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <span className="text-gold" style={{
                            fontFamily: "var(--font-accent)",
                            fontSize: "var(--fs-xs)",
                            letterSpacing: "var(--ls-wide)",
                          }}>
                            {order.orderId}
                          </span>
                        </td>
                        <td className="font-medium" style={{ color: "var(--color-white)" }}>
                          {order.clientName}
                        </td>
                        <td>{order.eventTitle}</td>
                        <td style={{ color: "var(--color-success)", fontFamily: "var(--font-accent)" }}>
                          ₹{order.total.toLocaleString("en-IN")}
                        </td>
                        <td>
                          <span className={orderStatusBadge[order.status] ?? "badge badge-gray"}>
                            {order.status}
                          </span>
                        </td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td>
                          <Link
                            href={`/admin/orders/${order.orderId}`}
                            className="btn btn-dark btn-sm"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {/* END Recent Orders */}

          {/* Upcoming Events Table */}
          <div className="table-container">
            <div className="table-header">
              <span className="table-title">Upcoming Events</span>
              <Link href="/admin/events" className="btn btn-ghost btn-sm">
                View All →
              </Link>
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="p-8 text-center text-muted">
                Koi upcoming event nahi hai 📅
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Client</th>
                    <th>Date</th>
                    <th>Days Left</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingEvents.map((event) => (
                    <tr key={event._id}>
                      <td>
                        <div className="font-medium" style={{ color: "var(--color-white)" }}>
                          {event.title}
                        </div>
                        <div className="text-xs text-muted">{event.eventId}</div>
                      </td>
                      <td>
                        <Link
                          href={`/admin/clients/${event.clientCode}`}
                          className="text-gold"
                          style={{ fontSize: "var(--fs-sm)" }}
                        >
                          {event.clientName}
                        </Link>
                      </td>
                      <td>{formatDateShort(event.eventDate)}</td>
                      <td>
                        <span style={{
                          color: event.daysUntil <= 3
                            ? "var(--color-error)"
                            : event.daysUntil <= 7
                              ? "var(--color-warning)"
                              : "var(--color-success)",
                          fontWeight: "var(--fw-semibold)",
                          fontSize: "var(--fs-sm)",
                        }}>
                          {event.daysUntil === 0
                            ? "🔴 Today!"
                            : event.daysUntil === 1
                              ? "🟡 Tomorrow"
                              : `${event.daysUntil}d`}
                        </span>
                      </td>
                      <td>
                        <span className={eventStatusBadge[event.status] ?? "badge badge-gray"}>
                          {event.status}
                        </span>
                      </td>
                      <td>
                        <Link
                          href={`/admin/events/${event.eventId}`}
                          className="btn btn-dark btn-sm"
                        >
                          Open
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {/* END Upcoming Events */}

        </div>
        {/* END LEFT COLUMN */}

        {/* ── RIGHT COLUMN ── */}
        <div className="flex flex-col gap-6">

          {/* New Clients Card */}
          <div className="table-container">
            <div className="table-header">
              <span className="table-title">New Clients</span>
              <Link href="/admin/clients" className="btn btn-ghost btn-sm">
                View All →
              </Link>
            </div>

            {recentClients.length === 0 ? (
              <div className="p-8 text-center text-muted text-sm">
                Koi client nahi hai abhi tak 👥
              </div>
            ) : (
              <div style={{ padding: "0 var(--space-2)" }}>
                {recentClients.map((client, idx) => (
                  <Link
                    key={client._id}
                    href={`/admin/clients/${client.clientId}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-3)",
                        padding: "var(--space-4)",
                        borderBottom: idx < recentClients.length - 1
                          ? "1px solid var(--color-black-border)"
                          : "none",
                        transition: "background var(--transition-fast)",
                        borderRadius: "var(--radius-md)",
                      }}
                      className="client-list-row"
                    >
                      {/* Avatar */}
                      <div style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "var(--radius-full)",
                        background: "rgba(201,168,76,0.12)",
                        border: "1px solid rgba(201,168,76,0.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-accent)",
                        fontSize: "var(--fs-sm)",
                        fontWeight: "var(--fw-bold)",
                        color: "var(--color-gold)",
                        flexShrink: 0,
                      }}>
                        {client.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          color: "var(--color-white)",
                          fontWeight: "var(--fw-medium)",
                          fontSize: "var(--fs-sm)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}>
                          {client.name}
                        </p>
                        <p className="text-xs text-muted" style={{ marginTop: "2px" }}>
                          {client.phone}
                        </p>
                      </div>

                      {/* Meta */}
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p style={{
                          fontSize: "var(--fs-xs)",
                          color: "var(--color-gold)",
                          fontWeight: "var(--fw-semibold)",
                        }}>
                          {client.eventsCount} event{client.eventsCount !== 1 ? "s" : ""}
                        </p>
                        <p className="text-xs text-muted" style={{ marginTop: "2px" }}>
                          {formatDateShort(client.createdAt)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          {/* END New Clients */}

          {/* Quick Links Card */}
          <div className="card">
            <div className="section-label">Quick Links</div>
            <div className="flex flex-col gap-2">
              {[
                { href: "/admin/clients/new", icon: "👤", label: "Register New Client" },
                { href: "/admin/events/new", icon: "📸", label: "Create New Event" },
                { href: "/admin/payments", icon: "💳", label: "View Payments" },
                { href: "/admin/gallery", icon: "🖼️", label: "Public Gallery" },
                { href: "/admin/services", icon: "⚙️", label: "Services Config" },
                { href: "/admin/settings", icon: "🔧", label: "Settings" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                    padding: "var(--space-3) var(--space-4)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--color-white-muted)",
                    fontSize: "var(--fs-sm)",
                    textDecoration: "none",
                    transition: "all var(--transition-fast)",
                    border: "1px solid transparent",
                  }}
                  className="quick-link-item"
                >
                  <span style={{ fontSize: "16px" }}>{item.icon}</span>
                  <span>{item.label}</span>
                  <span style={{ marginLeft: "auto", color: "var(--color-white-dim)" }}>
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
          {/* END Quick Links */}

          {/* Pending Attention Card */}
          {stats.pendingOrders > 0 && (
            <div
              className="card"
              style={{
                borderColor: "rgba(243,156,18,0.4)",
                background: "rgba(243,156,18,0.05)",
              }}
            >
              <div className="section-label" style={{ color: "var(--color-warning)" }}>
                ⚠ Attention Needed
              </div>
              <div className="flex flex-col gap-3">
                {stats.pendingOrders > 0 && (
                  <Link href="/admin/orders?status=pending" style={{ textDecoration: "none" }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "var(--space-3) var(--space-4)",
                      background: "rgba(243,156,18,0.08)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid rgba(243,156,18,0.2)",
                    }}>
                      <span className="text-sm" style={{ color: "var(--color-warning)" }}>
                        🧾 Pending Orders
                      </span>
                      <span style={{
                        background: "var(--color-warning)",
                        color: "var(--color-black)",
                        fontWeight: "var(--fw-bold)",
                        fontSize: "var(--fs-xs)",
                        padding: "2px 8px",
                        borderRadius: "var(--radius-full)",
                      }}>
                        {stats.pendingOrders}
                      </span>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          )}
          {/* END Attention Card */}

        </div>
        {/* END RIGHT COLUMN */}

      </div>
      {/* END Main Grid */}

      {/* Responsive fix */}
      <style>{`
        .dashboard-grid {
          grid-template-columns: 1fr 380px;
        }
        @media (max-width: 1100px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .client-list-row:hover {
          background: rgba(201, 168, 76, 0.05) !important;
        }
        .quick-link-item:hover {
          background: rgba(201, 168, 76, 0.08) !important;
          color: var(--color-gold) !important;
          border-color: rgba(201, 168, 76, 0.2) !important;
        }
      `}</style>

    </div>
  );
}