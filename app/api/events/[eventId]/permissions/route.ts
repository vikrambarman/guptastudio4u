// app/api/events/[eventId]/permissions/route.ts
import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Event from "@/lib/db/models/Event";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

interface RouteParams {
  params: Promise<{ eventId: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user) return apiError("Unauthorized", 401);

  const { eventId } = await params;
  await connectDB();

  const body = await request.json();
  const {
    downloadEnabled,
    paymentRequired,
    paymentAmount,
    paymentNote,
    paymentStatus,
    paymentReferenceNote,
    expiryDate,
  } = body;

  const event = await Event.findOne({ eventId: eventId.toUpperCase() });
  if (!event) return apiError("Event not found", 404);

  const adminObjectId = new mongoose.Types.ObjectId(session.user.id);

  if (downloadEnabled !== undefined) {
    event.permissions.downloadEnabled = downloadEnabled;
    if (downloadEnabled) {
      event.permissions.downloadEnabledAt = new Date();
      event.permissions.downloadEnabledBy = adminObjectId;
    }
  }

  if (paymentRequired !== undefined) {
    event.permissions.paymentRequired = paymentRequired;
  }
  if (paymentAmount !== undefined) {
    event.permissions.paymentAmount = Number(paymentAmount) || 0;
  }
  if (paymentNote !== undefined) {
    event.permissions.paymentNote = paymentNote;
  }
  if (paymentStatus !== undefined) {
    event.permissions.paymentStatus = paymentStatus;
    if (paymentStatus === "received") {
      event.permissions.paymentReceivedAt = new Date();
      event.permissions.paymentReceivedBy = adminObjectId;
    }
  }
  if (paymentReferenceNote !== undefined) {
    event.permissions.paymentReferenceNote = paymentReferenceNote;
  }
  if (expiryDate !== undefined) {
    event.permissions.expiryDate = expiryDate ? new Date(expiryDate) : undefined;
  }

  await event.save();

  return apiSuccess(event.permissions, {
    message: "Permissions updated successfully",
  });
}