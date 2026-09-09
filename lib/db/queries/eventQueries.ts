// lib/db/queries/eventQueries.ts
import Event from "@/lib/db/models/Event";
import type { IEvent, IEventPermissions } from "@/types";

interface PopulatedClient {
  _id: { toString(): string };
  clientId: string;
  name: string;
  phone: string;
  email?: string;
}

export interface EventListItem extends Omit<IEvent, "clientId"> {
  clientId: string;
  clientCode: string;
  clientName: string;
  clientPhone: string;
}

interface EventQueryOptions {
  search?: string;
  status?: string;
  clientDbId?: string;
  page?: number;
  limit?: number;
}

function toIdString(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "object" && "toString" in value) {
    return (value as { toString(): string }).toString();
  }
  return undefined;
}

/**
 * Mongoose ke ObjectId fields (jo permissions.downloadEnabledBy /
 * paymentReceivedBy me hote hain) ko plain string me convert karo.
 * Isse @/types wale IEventPermissions se type match ho jaata hai,
 * AUR Server->Client Component serialization bhi safe ho jaata hai.
 */
function serializePermissions(
  perms: Record<string, unknown>
): IEventPermissions {
  return {
    downloadEnabled: Boolean(perms.downloadEnabled),
    downloadEnabledAt: perms.downloadEnabledAt as Date | undefined,
    downloadEnabledBy: toIdString(perms.downloadEnabledBy),

    paymentRequired: Boolean(perms.paymentRequired),
    paymentAmount: Number(perms.paymentAmount) || 0,
    paymentNote: (perms.paymentNote as string) || "",

    paymentStatus: perms.paymentStatus as IEventPermissions["paymentStatus"],
    paymentReceivedAt: perms.paymentReceivedAt as Date | undefined,
    paymentReceivedBy: toIdString(perms.paymentReceivedBy),
    paymentReferenceNote: (perms.paymentReferenceNote as string) || "",

    expiryDate: perms.expiryDate as Date | undefined,
    maxDownloads: perms.maxDownloads as number | undefined,
  };
}

/** Populated client + permissions ko fully serializable, typed shape do */
function flattenEvent(event: Record<string, unknown>): EventListItem {
  const client = event.clientId as PopulatedClient | null;
  const permissions = serializePermissions(
    (event.permissions as Record<string, unknown>) || {}
  );

  return {
    ...event,
    _id: toIdString(event._id) as string,
    clientId: client?._id ? (toIdString(client._id) as string) : "",
    clientCode: client?.clientId ?? "",
    clientName: client?.name ?? "Unknown Client",
    clientPhone: client?.phone ?? "",
    permissions,
    createdBy: toIdString(event.createdBy) as string,
    assignedStaff: Array.isArray(event.assignedStaff)
      ? (event.assignedStaff as unknown[]).map((id) => toIdString(id) as string)
      : [],
  } as EventListItem;
}

export async function getEventsList({
  search = "",
  status = "",
  clientDbId = "",
  page = 1,
  limit = 20,
}: EventQueryOptions) {
  const query: Record<string, unknown> = {};

  if (search.trim()) {
    query.$or = [
      { title: new RegExp(search, "i") },
      { eventId: new RegExp(search, "i") },
      { venue: new RegExp(search, "i") },
    ];
  }
  if (status) query.status = status;
  if (clientDbId) query.clientId = clientDbId;

  const [events, total] = await Promise.all([
    Event.find(query)
      .populate("clientId", "clientId name phone")
      .sort({ eventDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Event.countDocuments(query),
  ]);

  return {
    events: events.map((e) => flattenEvent(e as unknown as Record<string, unknown>)),
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getEventDetail(
  eventId: string
): Promise<EventListItem | null> {
  const event = await Event.findOne({ eventId: eventId.toUpperCase() })
    .populate("clientId", "clientId name phone email")
    .lean();

  if (!event) return null;
  return flattenEvent(event as unknown as Record<string, unknown>);
}


/**
 * Payments Dashboard ke liye — un events ki list jinka
 * download-access payment abhi pending hai.
 */
export async function getPendingPaymentEvents(limit = 50) {
  const events = await Event.find({
    "permissions.paymentRequired": true,
    "permissions.paymentStatus": "pending",
  })
    .populate("clientId", "clientId name phone")
    .sort({ eventDate: -1 })
    .limit(limit)
    .lean();

  return events.map((e) =>
    flattenEvent(e as unknown as Record<string, unknown>)
  );
}


/** Client ke apne events me se jinka payment abhi pending hai */
export async function getClientPendingPaymentEvents(clientDbId: string) {
  const events = await Event.find({
    clientId: clientDbId,
    "permissions.paymentRequired": true,
    "permissions.paymentStatus": { $ne: "received" },
  })
    .sort({ eventDate: -1 })
    .lean();

  return events.map((e) =>
    flattenEvent(e as unknown as Record<string, unknown>)
  );
}