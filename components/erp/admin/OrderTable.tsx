// components/erp/admin/OrderTable.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface OrderRow {
  _id: string;
  orderId: string;
  orderType: string;
  status: string;
  total: number;
  selectedMediaCount: number;
  clientCode: string;
  clientName: string;
  eventCode: string;
  eventTitle: string;
  createdAt: string;
}

const STATUS_BADGE: Record<string, string> = {
  pending: "badge-gray",
  payment_pending: "badge-warning",
  payment_received: "badge-info",
  processing: "badge-info",
  completed: "badge-success",
  cancelled: "badge-error",
};

export default function OrderTable({
  orders,
  search,
  status,
  currentPage,
  totalPages,
}: {
  orders: OrderRow[];
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
    router.push(`/admin/orders?${params.toString()}`);
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    params.set("page", String(page));
    router.push(`/admin/orders?${params.toString()}`);
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <span className="table-title">All Orders</span>
        <div className="flex gap-2">
          <select
            className="form-input form-select"
            value={status}
            onChange={(e) => applyFilters({ status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="payment_pending">Payment Pending</option>
            <option value="payment_received">Payment Received</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <input
            type="text"
            className="form-input"
            placeholder="Search Order ID..."
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

      {orders.length === 0 ? (
        <div className="p-8 text-center text-muted">Koi order nahi mila.</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Client</th>
              <th>Event</th>
              <th>Type</th>
              <th>Media</th>
              <th>Total</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="text-gold font-medium">{order.orderId}</td>
                <td>
                  <div className="text-sm">{order.clientName}</div>
                  <div className="text-xs text-muted">{order.clientCode}</div>
                </td>
                <td>
                  <div className="text-sm">{order.eventTitle}</div>
                  <div className="text-xs text-muted">{order.eventCode}</div>
                </td>
                <td className="uppercase text-xs">
                  {order.orderType.replace("_", " ")}
                </td>
                <td>{order.selectedMediaCount}</td>
                <td>₹{order.total}</td>
                <td>
                  <span
                    className={`badge ${STATUS_BADGE[order.status] || "badge-gray"}`}
                  >
                    {order.status.replace("_", " ")}
                  </span>
                </td>
                <td>
                  <Link
                    href={`/admin/orders/${order.orderId}`}
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