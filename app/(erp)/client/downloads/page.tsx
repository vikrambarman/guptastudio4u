// app/(erp)/client/downloads/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db/mongodb";
import { getClientSession } from "@/lib/auth/getClientSession";
import { getClientOrdersList } from "@/lib/db/queries/orderQueries";

const STATUS_BADGE: Record<string, string> = {
  pending: "badge-gray",
  payment_pending: "badge-warning",
  payment_received: "badge-info",
  processing: "badge-info",
  completed: "badge-success",
  cancelled: "badge-error",
};

export default async function ClientDownloadsPage() {
  const client = await getClientSession();
  if (!client) redirect("/client-portal");

  await connectDB();
  const orders = await getClientOrdersList(client.clientDbId);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-gold">My Downloads & Album Requests</h1>
        <p className="text-muted text-sm mt-1">
          Apne album/print requests ka status yahan dekhein. Photos/videos
          directly download karne ke liye apne event page pe jayein.
        </p>
      </div>

      <div className="table-container">
        <div className="table-header">
          <span className="table-title">
            Album/Print Requests ({orders.length})
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="p-8 text-center text-muted">
            Abhi tak koi album/print request nahi bheji hai.
            <div className="mt-4">
              <Link href="/client/my-events" className="btn btn-gold btn-sm">
                My Events Dekhein
              </Link>
            </div>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Event</th>
                <th>Media Count</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Requested On</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td className="text-gold font-medium">{order.orderId}</td>
                  <td>
                    <div className="text-sm">{order.eventTitle}</div>
                    <div className="text-xs text-muted">
                      {order.eventCode}
                    </div>
                  </td>
                  <td>{order.selectedMediaCount}</td>
                  <td>{order.total > 0 ? `₹${order.total}` : "—"}</td>
                  <td>
                    <span
                      className={`badge ${STATUS_BADGE[order.status] || "badge-gray"}`}
                    >
                      {order.status.replace("_", " ")}
                    </span>
                  </td>
                  <td>
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
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