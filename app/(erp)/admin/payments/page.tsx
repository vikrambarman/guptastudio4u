// app/(erp)/admin/payments/page.tsx
import Link from "next/link";
import connectDB from "@/lib/db/mongodb";
import { getPendingPaymentEvents } from "@/lib/db/queries/eventQueries";
import { getPendingPaymentOrders } from "@/lib/db/queries/orderQueries";
import QuickPaymentActions from "@/components/erp/admin/QuickPaymentActions";

export default async function PaymentsPage() {
    await connectDB();

    const [eventPayments, orderPayments] = await Promise.all([
        getPendingPaymentEvents(),
        getPendingPaymentOrders(),
    ]);

    return (
        <div>
            <h1 className="text-gold mb-6">Payments</h1>

            <div className="table-container mb-8">
                <div className="table-header">
                    <span className="table-title">
                        Event Access Payments ({eventPayments.length})
                    </span>
                </div>
                {eventPayments.length === 0 ? (
                    <div className="p-8 text-center text-muted">
                        Koi pending payment nahi hai.
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Event</th>
                                <th>Client</th>
                                <th>Amount</th>
                                <th>Note</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {eventPayments.map((event) => (
                                <tr key={event._id}>
                                    <td>
                                        <Link
                                            href={`/admin/events/${event.eventId}`}
                                            className="text-gold font-medium"
                                        >
                                            {event.eventId}
                                        </Link>
                                        <div className="text-xs text-muted">{event.title}</div>
                                    </td>
                                    <td>
                                        <div className="text-sm">{event.clientName}</div>
                                        <div className="text-xs text-muted">
                                            {event.clientCode}
                                        </div>
                                    </td>
                                    <td>₹{event.permissions.paymentAmount}</td>
                                    <td className="text-xs text-muted">
                                        {event.permissions.paymentNote}
                                    </td>
                                    <td>
                                        <QuickPaymentActions type="event" id={event.eventId} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="table-container">
                <div className="table-header">
                    <span className="table-title">
                        Order Payments — Album/Print ({orderPayments.length})
                    </span>
                </div>
                {orderPayments.length === 0 ? (
                    <div className="p-8 text-center text-muted">
                        Koi pending order payment nahi hai.
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Client</th>
                                <th>Event</th>
                                <th>Total</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderPayments.map((order) => (
                                <tr key={order._id}>
                                    <td>
                                        <Link
                                            href={`/admin/orders/${order.orderId}`}
                                            className="text-gold font-medium"
                                        >
                                            {order.orderId}
                                        </Link>
                                    </td>
                                    <td>
                                        <div className="text-sm">{order.clientName}</div>
                                        <div className="text-xs text-muted">
                                            {order.clientCode}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="text-sm">{order.eventTitle}</div>
                                        <div className="text-xs text-muted">
                                            {order.eventCode}
                                        </div>
                                    </td>
                                    <td>₹{order.total}</td>
                                    <td>
                                        <QuickPaymentActions type="order" id={order.orderId} />
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