// app/(erp)/client/payments/page.tsx
import { redirect } from "next/navigation";
import connectDB from "@/lib/db/mongodb";
import { getClientSession } from "@/lib/auth/getClientSession";
import { getClientPendingPaymentEvents } from "@/lib/db/queries/eventQueries";
import { getClientOrdersList } from "@/lib/db/queries/orderQueries";
import PaymentQRCard from "@/components/shared/PaymentQRCard";

export default async function ClientPaymentsPage() {
    const client = await getClientSession();
    if (!client) redirect("/client-portal");

    await connectDB();

    const [pendingEvents, orders] = await Promise.all([
        getClientPendingPaymentEvents(client.clientDbId),
        getClientOrdersList(client.clientDbId),
    ]);

    const pendingOrders = orders.filter(
        (o) => o.status === "pending" || o.status === "payment_pending"
    );

    const hasNothingPending =
        pendingEvents.length === 0 && pendingOrders.length === 0;

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-gold">Payments</h1>
                <p className="text-muted text-sm mt-1">
                    Apne pending payments yahan complete karein.
                </p>
            </div>

            {hasNothingPending && (
                <div className="payment-received-banner">
                    <span>✅</span>
                    <span className="text-sm">
                        Abhi koi payment pending nahi hai. Sab clear hai!
                    </span>
                </div>
            )}

            {pendingEvents.length > 0 && (
                <div className="mb-10">
                    <h3 className="text-white mb-4">Event Access Payments</h3>
                    <div className="grid grid-cols-2 gap-6">
                        {pendingEvents.map((event) => (
                            <div key={event.eventId} className="card">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <span className="text-gold font-bold">
                                            {event.eventId}
                                        </span>
                                        <h4 className="text-white mt-1">{event.title}</h4>
                                    </div>
                                    <span className="badge badge-warning">Pending</span>
                                </div>
                                <PaymentQRCard
                                    amount={event.permissions.paymentAmount}
                                    note={event.permissions.paymentNote}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {pendingOrders.length > 0 && (
                <div>
                    <h3 className="text-white mb-4">Album/Print Order Payments</h3>
                    <div className="grid grid-cols-2 gap-6">
                        {pendingOrders.map((order) => (
                            <div key={order.orderId} className="card">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <span className="text-gold font-bold">
                                            {order.orderId}
                                        </span>
                                        <h4 className="text-white mt-1">{order.eventTitle}</h4>
                                    </div>
                                    <span className="badge badge-warning">Pending</span>
                                </div>
                                {order.total > 0 ? (
                                    <PaymentQRCard
                                        amount={order.total}
                                        note={order.paymentInfo?.note || "Album/Print charges"}
                                    />
                                ) : (
                                    <p className="text-sm text-muted">
                                        Studio abhi is order ka amount finalize kar raha hai. Jald
                                        hi update milega.
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}