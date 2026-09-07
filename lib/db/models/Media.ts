// lib/db/models/Media.ts
import mongoose, { Schema, Model, Document } from "mongoose";

export type MediaType = "photo" | "video" | "reel";

export interface IMediaDocument extends Document {
  mediaId: string;
  eventId: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  fileName: string;
  originalName: string;
  fileType: MediaType;
  mimeType: string;
  fileSize: number;
  r2Key: string;
  r2Bucket: string;
  thumbnailKey?: string;
  width?: number;
  height?: number;
  duration?: number;
  isPublic: boolean;
  isClientSelected: boolean;   // ✅ Renamed from isSelected
  selectedBy?: mongoose.Types.ObjectId;
  selectedAt?: Date;
  downloadCount: number;
  lastDownloadAt?: Date;
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const MediaSchema = new Schema<IMediaDocument>(
  {
    mediaId: {
      type: String,
      unique: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ["photo", "video", "reel"],
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    r2Key: {
      type: String,
      required: true,
    },
    r2Bucket: {
      type: String,
      required: true,
    },
    thumbnailKey: {
      type: String,
    },
    width: Number,
    height: Number,
    duration: Number,
    isPublic: {
      type: Boolean,
      default: false,
    },
    isClientSelected: {          // ✅ Renamed
      type: Boolean,
      default: false,
    },
    selectedBy: {
      type: Schema.Types.ObjectId,
      ref: "Client",
    },
    selectedAt: Date,
    downloadCount: {
      type: Number,
      default: 0,
    },
    lastDownloadAt: Date,
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// ============================================================
// AUTO GENERATE Media ID: MEDIA-2024-000001
// ============================================================
MediaSchema.pre("save", async function (next) {
  if (this.isNew && !this.mediaId) {
    const year = new Date().getFullYear();
    const MediaModel = mongoose.models.Media as Model<IMediaDocument>;

    const lastMedia = await MediaModel.findOne({
      mediaId: new RegExp(`^MEDIA-${year}-`),
    }).sort({ createdAt: -1 });

    let nextNumber = 1;
    if (lastMedia) {
      const lastNumber = parseInt(lastMedia.mediaId.split("-")[2], 10);
      nextNumber = lastNumber + 1;
    }

    this.mediaId = `MEDIA-${year}-${String(nextNumber).padStart(6, "0")}`;
  }
});

MediaSchema.index({ eventId: 1 });
MediaSchema.index({ clientId: 1 });
MediaSchema.index({ fileType: 1 });
MediaSchema.index({ isPublic: 1 });
MediaSchema.index({ eventId: 1, fileType: 1 });

const Media: Model<IMediaDocument> =
  mongoose.models.Media || mongoose.model<IMediaDocument>("Media", MediaSchema);

export default Media;