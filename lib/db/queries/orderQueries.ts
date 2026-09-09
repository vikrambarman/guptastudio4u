// lib/db/queries/orderQueries.ts
import Order from "@/lib/db/models/Order";
import { getDownloadPresignedUrl } from "@/lib/storage/presign";

function toIdString(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && "toString" in value) {
    return (value as { toString(): string }).toString();
  }
  return "";
}

export interface OrderListItem {
  _id: string;
  orderId: string;
  orderType: string;
  status: string;
  total: number;
  selectedMediaCount: number;
  clientCode: string;
  clientName: string;
  clientPhone: string;
  eventCode: string;
  eventTitle: string;
  createdAt: Date;
}

function flattenOrder(order: Record<string, unknown>): OrderListItem {
  const client = order.clientId as {
    clientId?: string;
    name?: string;
    phone?: string;
  } | null;
  const event = order.eventId as { eventId?: string; title?: string } | null;

  return {
    _id: toIdString(order._id),
    orderId: order.orderId as string,
    orderType: order.orderType as string,
    status: order.status as string,
    total: (order.total as number) || 0,
    selectedMediaCount: Array.isArray(order.selectedMedia)
      ? (order.selectedMedia as unknown[]).length
      : 0,
    clientCode: client?.clientId || "",
    clientName: client?.name || "Unknown",
    clientPhone: client?.phone || "",
    eventCode: event?.eventId || "",
    eventTitle: event?.title || "",
    createdAt: order.createdAt as Date,
  };
}

interface OrderQueryOptions {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export async function getOrdersList({
  search = "",
  status = "",
  page = 1,
  limit = 20,
}: OrderQueryOptions) {
  const query: Record<string, unknown> = {};
  if (status) query.status = status;
  if (search.trim()) query.orderId = new RegExp(search.trim(), "i");

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate("clientId", "clientId name phone")
      .populate("eventId", "eventId title")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Order.countDocuments(query),
  ]);

  return {
    orders: orders.map((o) =>
      flattenOrder(o as unknown as Record<string, unknown>)
    ),
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export interface OrderDetail extends OrderListItem {
  clientDbId: string;
  eventDbId: string;
  discount: number;
  subtotal: number;
  notes: string;
  paymentInfo?: {
    upiId: string;
    qrImageUrl: string;
    amount: number;
    note: string;
    paidAt?: Date;
    transactionRef?: string;
  };
  media: {
    mediaId: string;
    originalName: string;
    fileType: string;
    previewUrl: string | null;
  }[];
}

export async function getOrderDetail(
  orderId: string
): Promise<OrderDetail | null> {
  const order = await Order.findOne({ orderId: orderId.toUpperCase() })
    .populate("clientId", "clientId name phone")
    .populate("eventId", "eventId title")
    .populate(
      "selectedMedia",
      "mediaId originalName fileType thumbnailKey r2Key"
    )
    .lean();

  if (!order) return null;

  const mediaList = (order.selectedMedia || []) as unknown as Array<{
    mediaId: string;
    originalName: string;
    fileType: string;
    thumbnailKey?: string;
    r2Key: string;
  }>;

  const mediaWithUrls = await Promise.all(
    mediaList.map(async (m) => ({
      mediaId: m.mediaId,
      originalName: m.originalName,
      fileType: m.fileType,
      previewUrl:
        m.fileType === "photo"
          ? await getDownloadPresignedUrl(m.thumbnailKey || m.r2Key, 1800)
          : null,
    }))
  );

  const flat = flattenOrder(order as unknown as Record<string, unknown>);
  const clientObj = order.clientId as { _id?: unknown } | null;
  const eventObj = order.eventId as { _id?: unknown } | null;

  return {
    ...flat,
    clientDbId: toIdString(clientObj?._id),
    eventDbId: toIdString(eventObj?._id),
    discount: order.discount || 0,
    subtotal: order.subtotal || 0,
    notes: order.notes || "",
    paymentInfo: order.paymentInfo,
    media: mediaWithUrls,
  };
}

/**
 * Payments Dashboard ke liye — un orders ki list jinka
 * payment abhi pending/receive hona baaki hai.
 */
export async function getPendingPaymentOrders(
  limit = 50
): Promise<OrderListItem[]> {
  const orders = await Order.find({
    status: { $in: ["pending", "payment_pending"] },
  })
    .populate("clientId", "clientId name phone")
    .populate("eventId", "eventId title")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return orders.map((o) =>
    flattenOrder(o as unknown as Record<string, unknown>)
  );
}



export interface ClientOrderItem {
  orderId: string;
  orderType: string;
  status: string;
  total: number;
  selectedMediaCount: number;
  eventCode: string;
  eventTitle: string;
  paymentInfo?: {
    amount: number;
    note: string;
    paidAt?: Date;
  };
  createdAt: Date;
}

/** Client apne saare orders (album/print requests) dekh sake — shared logic */
export async function getClientOrdersList(
  clientDbId: string
): Promise<ClientOrderItem[]> {
  const orders = await Order.find({ clientId: clientDbId })
    .populate("eventId", "eventId title")
    .sort({ createdAt: -1 })
    .lean();

  return orders.map((o) => {
    const event = o.eventId as unknown as {
      eventId?: string;
      title?: string;
    } | null;

    return {
      orderId: o.orderId,
      orderType: o.orderType,
      status: o.status,
      total: o.total || 0,
      selectedMediaCount: (o.selectedMedia || []).length,
      eventCode: event?.eventId || "",
      eventTitle: event?.title || "",
      paymentInfo: o.paymentInfo
        ? {
            amount: o.paymentInfo.amount,
            note: o.paymentInfo.note,
            paidAt: o.paymentInfo.paidAt,
          }
        : undefined,
      createdAt: o.createdAt,
    };
  });
}