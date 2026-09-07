// components/erp/admin/ClientSelector.tsx
"use client";

import { useState } from "react";

interface ClientOption {
  clientId: string;
  name: string;
  phone: string;
}

interface ClientSelectorProps {
  selected: ClientOption | null;
  onSelect: (client: ClientOption) => void;
}

export default function ClientSelector({
  selected,
  onSelect,
}: ClientSelectorProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ClientOption[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `/api/clients?search=${encodeURIComponent(query)}&limit=8`
      );
      const result = await res.json();
      if (result.success) setResults(result.data);
    } finally {
      setSearching(false);
    }
  };

  if (selected) {
    return (
      <div className="card card-gold" style={{ padding: "var(--space-4)" }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-gold font-bold">{selected.clientId}</div>
            <div className="text-sm text-muted mt-1">
              {selected.name} • {selected.phone}
            </div>
          </div>
          <button
            type="button"
            className="btn btn-dark btn-sm"
            onClick={() => onSelect(null as unknown as ClientOption)}
          >
            Change
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-group">
      <label className="form-label">Select Client *</label>
      <div className="flex gap-2">
        <input
          type="text"
          className="form-input"
          placeholder="Name, phone ya Client ID se search karein"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
        />
        <button
          type="button"
          className="btn btn-dark btn-sm"
          onClick={handleSearch}
          disabled={searching}
        >
          {searching ? <span className="loader" /> : "Search"}
        </button>
      </div>

      {results.length > 0 && (
        <div className="flex flex-col gap-2 mt-3">
          {results.map((client) => (
            <button
              key={client.clientId}
              type="button"
              className="card"
              style={{
                padding: "var(--space-3) var(--space-4)",
                textAlign: "left",
                cursor: "pointer",
              }}
              onClick={() => {
                onSelect(client);
                setResults([]);
                setQuery("");
              }}
            >
              <span className="text-gold font-medium">{client.clientId}</span>
              <span className="text-sm text-muted"> — {client.name} ({client.phone})</span>
            </button>
          ))}
        </div>
      )}

      <span className="form-hint">
        Client nahi mila?{" "}
        <a href="/admin/clients/new" className="text-gold">
          Pehle register karein
        </a>
      </span>
    </div>
  );
}