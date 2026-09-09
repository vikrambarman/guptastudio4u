// app/api/orders/[orderId]/route.ts
import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Order from "@/lib/db/models/Order";
import { getOrderDetail } from "@/lib/db/queries/orderQueries";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

interface RouteParams {
    params: Promise<{ orderId: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const { orderId } = await params;
    await connectDB();

    const order = await getOrderDetail(orderId);
    if (!order) return apiError("Order not found", 404);

    return apiSuccess(order);
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const { orderId } = await params;
    await connectDB();

    const body = await request.json();
    const { status, subtotal, discount, total, notes, paymentInfo } = body as {
        status?: string;
        subtotal?: number;
        discount?: number;
        total?: number;
        notes?: string;
        paymentInfo?: {
            upiId?: string;
            qrImageUrl?: string;
            amount?: number;
            note?: string;
            transactionRef?: string;
            markPaid?: boolean;
        };
    };

    const order = await Order.findOne({ orderId: orderId.toUpperCase() });
    if (!order) return apiError("Order not found", 404);

    if (status !== undefined) order.status = status as typeof order.status;
    if (subtotal !== undefined) order.subtotal = Number(subtotal) || 0;
    if (discount !== undefined) order.discount = Number(discount) || 0;
    if (total !== undefined) order.total = Number(total) || 0;
    if (notes !== undefined) order.notes = notes;

    if (paymentInfo) {
        const current = order.paymentInfo || {
            upiId: "",
            qrImageUrl: "",
            amount: 0,
            note: "",
            transactionRef: "",
        };

        order.paymentInfo = {
            upiId: paymentInfo.upiId ?? current.upiId,
            qrImageUrl: paymentInfo.qrImageUrl ?? current.qrImageUrl,
            amount: paymentInfo.amount ?? current.amount,
            note: paymentInfo.note ?? current.note,
            transactionRef: paymentInfo.transactionRef ?? current.transactionRef,
            paidAt: current.paidAt,
            markedBy: current.markedBy,
        };

        if (paymentInfo.markPaid) {
            order.paymentInfo.paidAt = new Date();
            order.paymentInfo.markedBy = new mongoose.Types.ObjectId(
                session.user.id
            );
            if (order.status === "pending" || order.status === "payment_pending") {
                order.status = "payment_received";
            }
        }
    }

    await order.save();

    return apiSuccess(order, { message: "Order updated successfully" });
}