// lib/db/models/Order.ts
import mongoose, { Schema, Model, Document } from "mongoose";

export type OrderType =
  | "photo_download"
  | "video_download"
  | "mixed_download"
  | "printing"
  | "decoration"
  | "other";

export type OrderStatus =
  | "pending"
  | "payment_pending"
  | "payment_received"
  | "processing"
  | "completed"
  | "cancelled";

export interface IOrderDocument extends Document {
  orderId: string;
  clientId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  orderType: OrderType;
  selectedMedia: mongoose.Types.ObjectId[];
  subtotal: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentInfo?: {
    upiId: string;
    qrImageUrl: string;
    amount: number;
    note: string;
    paidAt?: Date;
    transactionRef?: string;
    markedBy?: mongoose.Types.ObjectId;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderId: {
      type: String,
      unique: true,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    orderType: {
      type: String,
      enum: [
        "photo_download",
        "video_download",
        "mixed_download",
        "printing",
        "decoration",
        "other",
      ],
      required: true,
    },
    selectedMedia: [
      {
        type: Schema.Types.ObjectId,
        ref: "Media",
      },
    ],
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    status: {
      type: String,
      enum: [
        "pending",
        "payment_pending",
        "payment_received",
        "processing",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
    paymentInfo: {
      upiId: { type: String, default: "" },
      qrImageUrl: { type: String, default: "" },
      amount: { type: Number, default: 0 },
      note: { type: String, default: "" },
      paidAt: { type: Date },
      transactionRef: { type: String, default: "" },
      markedBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// ============================================================
// AUTO GENERATE Order ID: ORD-2024-001
// ============================================================
OrderSchema.pre("save", async function (next) {
  if (this.isNew && !this.orderId) {
    const year = new Date().getFullYear();
    const OrderModel = mongoose.models.Order as Model<IOrderDocument>;

    const lastOrder = await OrderModel.findOne({
      orderId: new RegExp(`^ORD-${year}-`),
    }).sort({ createdAt: -1 });

    let nextNumber = 1;
    if (lastOrder) {
      const lastNumber = parseInt(lastOrder.orderId.split("-")[2], 10);
      nextNumber = lastNumber + 1;
    }

    this.orderId = `ORD-${year}-${String(nextNumber).padStart(3, "0")}`;
  }
});

OrderSchema.index({ orderId: 1 });
OrderSchema.index({ clientId: 1 });
OrderSchema.index({ eventId: 1 });
OrderSchema.index({ status: 1 });

const Order: Model<IOrderDocument> =
  mongoose.models.Order || mongoose.model<IOrderDocument>("Order", OrderSchema);

export default Order;