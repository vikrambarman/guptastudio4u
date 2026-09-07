// lib/db/models/Event.ts
import mongoose, { Schema, Model, Document } from "mongoose";

export type EventType =
  | "wedding"
  | "birthday"
  | "party"
  | "corporate"
  | "maternity"
  | "product"
  | "other";

export type EventStatus = "upcoming" | "ongoing" | "completed" | "delivered";
export type PaymentStatus = "pending" | "received" | "not_required";

export interface IEventPermissions {
  downloadEnabled: boolean;
  downloadEnabledAt?: Date;
  downloadEnabledBy?: mongoose.Types.ObjectId;

  paymentRequired: boolean;
  paymentAmount: number;
  paymentNote: string;

  paymentStatus: PaymentStatus;
  paymentReceivedAt?: Date;
  paymentReceivedBy?: mongoose.Types.ObjectId;
  paymentReferenceNote?: string;

  expiryDate?: Date;
  maxDownloads?: number;
}

export interface IEventDocument extends Document {
  eventId: string;
  title: string;
  eventType: EventType;
  clientId: mongoose.Types.ObjectId;
  eventDate: Date;
  venue: string;
  description?: string;
  qrCode: string;
  status: EventStatus;
  totalPhotos: number;
  totalVideos: number;
  totalReels: number;
  permissions: IEventPermissions;
  packageDetails?: {
    name: string;
    price: number;
    includes: string[];
  };
  assignedStaff: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EventPermissionsSchema = new Schema<IEventPermissions>(
  {
    downloadEnabled: { type: Boolean, default: false },
    downloadEnabledAt: { type: Date },
    downloadEnabledBy: { type: Schema.Types.ObjectId, ref: "User" },

    paymentRequired: { type: Boolean, default: true },
    paymentAmount: { type: Number, default: 0 },
    paymentNote: {
      type: String,
      default: "Payment complete karke screenshot bhejein download ke liye",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "received", "not_required"],
      default: "pending",
    },
    paymentReceivedAt: { type: Date },
    paymentReceivedBy: { type: Schema.Types.ObjectId, ref: "User" },
    paymentReferenceNote: { type: String, default: "" },

    expiryDate: { type: Date },
    maxDownloads: { type: Number },
  },
  { _id: false }
);

const EventSchema = new Schema<IEventDocument>(
  {
    eventId: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    eventType: {
      type: String,
      enum: [
        "wedding",
        "birthday",
        "party",
        "corporate",
        "maternity",
        "product",
        "other",
      ],
      required: true,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    eventDate: {
      type: Date,
      required: [true, "Event date is required"],
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    qrCode: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "delivered"],
      default: "upcoming",
    },
    totalPhotos: { type: Number, default: 0 },
    totalVideos: { type: Number, default: 0 },
    totalReels: { type: Number, default: 0 },
    permissions: {
      type: EventPermissionsSchema,
      default: () => ({}),
    },
    packageDetails: {
      name: { type: String, default: "" },
      price: { type: Number, default: 0 },
      includes: [{ type: String }],
    },
    assignedStaff: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// ============================================================
// AUTO GENERATE Event ID: EVT-2024-001
// ============================================================
EventSchema.pre("save", async function (next) {
  if (this.isNew && !this.eventId) {
    const year = new Date().getFullYear();
    const EventModel = mongoose.models.Event as Model<IEventDocument>;

    const lastEvent = await EventModel.findOne({
      eventId: new RegExp(`^EVT-${year}-`),
    }).sort({ createdAt: -1 });

    let nextNumber = 1;
    if (lastEvent) {
      const lastNumber = parseInt(lastEvent.eventId.split("-")[2], 10);
      nextNumber = lastNumber + 1;
    }

    this.eventId = `EVT-${year}-${String(nextNumber).padStart(3, "0")}`;
  }
});

EventSchema.index({ eventId: 1 });
EventSchema.index({ clientId: 1 });
EventSchema.index({ status: 1 });
EventSchema.index({ eventDate: -1 });

const Event: Model<IEventDocument> =
  mongoose.models.Event || mongoose.model<IEventDocument>("Event", EventSchema);

export default Event;