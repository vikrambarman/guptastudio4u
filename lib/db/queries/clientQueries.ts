// lib/db/queries/clientQueries.ts
import Client from "@/lib/db/models/Client";

interface ClientQueryOptions {
  search?: string;
  page?: number;
  limit?: number;
}

export async function getClientsList({
  search = "",
  page = 1,
  limit = 20,
}: ClientQueryOptions) {
  const query: Record<string, unknown> = {};

  if (search.trim()) {
    query.$or = [
      { name: new RegExp(search, "i") },
      { phone: new RegExp(search, "i") },
      { clientId: new RegExp(search, "i") },
    ];
  }

  const [clients, total] = await Promise.all([
    Client.find(query)
      .select("-password -plainPassword")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Client.countDocuments(query),
  ]);

  return {
    clients,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}