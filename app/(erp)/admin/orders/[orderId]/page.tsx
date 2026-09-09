// app/(erp)/admin/orders/[orderId]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import connectDB from "@/lib/db/mongodb";
import { getOrderDetail } from "@/lib/db/queries/orderQueries";
import OrderStatusUpdater from "@/components/erp/admin/OrderStatusUpdater";

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { orderId } = await params;
  await connectDB();

  const order = await getOrderDetail(orderId);
  if (!order) notFound();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-gold">{order.orderId}</h1>
          <p className="text-muted text-sm mt-1">
            {order.orderType.replace("_", " ").toUpperCase()} •{" "}
            {new Date(order.createdAt).toLocaleDateString("en-IN")}
          </p>
        </div>
        <Link href="/admin/orders" className="btn btn-dark btn-sm">
          ← Back to Orders
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="text-sm text-muted mb-1">Client</div>
          <Link
            href={`/admin/clients/${order.clientCode}`}
            className="text-gold font-medium"
          >
            {order.clientName}
          </Link>
          <div className="text-xs text-muted mt-1">{order.clientCode}</div>
        </div>
        <div className="card">
          <div className="text-sm text-muted mb-1">Event</div>
          <Link
            href={`/admin/events/${order.eventCode}`}
            className="text-gold font-medium"
          >
            {order.eventTitle}
          </Link>
          <div className="text-xs text-muted mt-1">{order.eventCode}</div>
        </div>
        <div className="card">
          <div className="text-sm text-muted mb-1">Selected Media</div>
          <div className="text-white font-medium">
            {order.media.length} items
          </div>
        </div>
      </div>

      {order.notes && (
        <div className="card mb-6">
          <div className="section-label">Client Notes</div>
          <p className="text-sm text-muted">{order.notes}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <OrderStatusUpdater
          orderId={order.orderId}
          currentStatus={order.status}
          subtotal={order.subtotal}
          discount={order.discount}
          total={order.total}
          paymentInfo={
            order.paymentInfo
              ? {
                  upiId: order.paymentInfo.upiId,
                  qrImageUrl: order.paymentInfo.qrImageUrl,
                  amount: order.paymentInfo.amount,
                  note: order.paymentInfo.note,
                  transactionRef: order.paymentInfo.transactionRef,
                  paidAt: order.paymentInfo.paidAt
                    ? new Date(order.paymentInfo.paidAt).toISOString()
                    : undefined,
                }
              : undefined
          }
        />

        <div className="card">
          <div className="section-label">Selected Media Preview</div>
          {order.media.length === 0 ? (
            <p className="text-sm text-muted">Koi media attached nahi hai.</p>
          ) : (
            <div className="media-grid">
              {order.media.map((m) => (
                <div key={m.mediaId} className="media-item">
                  {m.fileType === "photo" && m.previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.previewUrl} alt={m.originalName} />
                  ) : (
                    <div
                      className="flex items-center justify-center w-full h-full"
                      style={{ background: "var(--color-black-soft)" }}
                    >
                      <span style={{ fontSize: "28px" }}>
                        {m.fileType === "video" ? "🎥" : "🎬"}
                      </span>
                    </div>
                  )}
                  <span className="media-item-type">
                    {m.fileType.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}