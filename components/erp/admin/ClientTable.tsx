// components/erp/admin/ClientTable.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { IClient } from "@/types";

interface ClientTableProps {
    clients: IClient[];
    search: string;
    currentPage: number;
    totalPages: number;
}

export default function ClientTable({
    clients,
    search,
    currentPage,
    totalPages,
}: ClientTableProps) {
    const router = useRouter();
    const [searchInput, setSearchInput] = useState(search);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchInput.trim()) params.set("search", searchInput.trim());
        router.push(`/admin/clients?${params.toString()}`);
    };

    const goToPage = (page: number) => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        params.set("page", String(page));
        router.push(`/admin/clients?${params.toString()}`);
    };

    return (
        <div className="table-container">
            <div className="table-header">
                <span className="table-title">All Clients</span>
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search name, phone or Client ID..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        style={{ minWidth: "260px" }}
                    />
                    <button type="submit" className="btn btn-dark btn-sm">
                        Search
                    </button>
                </form>
            </div>

            {clients.length === 0 ? (
                <div className="p-8 text-center text-muted">
                    Koi client nahi mila.{" "}
                    <Link href="/admin/clients/new" className="text-gold">
                        Naya client register karein
                    </Link>
                </div>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Client ID</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Registered</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client._id}>
                                <td>
                                    <span className="text-gold font-medium">
                                        {client.clientId}
                                    </span>
                                </td>
                                <td>{client.name}</td>
                                <td>{client.phone}</td>
                                <td>{client.email || "—"}</td>
                                <td>
                                    <span
                                        className={`badge ${client.isActive ? "badge-success" : "badge-error"
                                            }`}
                                    >
                                        {client.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td>{new Date(client.createdAt).toLocaleDateString("en-IN")}</td>
                                <td>
                                    <Link
                                        href={`/admin/clients/${client.clientId}`}
                                        className="btn btn-ghost btn-sm"
                                    >
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {totalPages > 1 && (
                <div
                    className="flex items-center justify-between p-4"
                    style={{ borderTop: "1px solid var(--color-black-border)" }}
                >
                    <span className="text-sm text-muted">
                        Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex gap-2">
                        <button
                            className="btn btn-dark btn-sm"
                            disabled={currentPage <= 1}
                            onClick={() => goToPage(currentPage - 1)}
                        >
                            Previous
                        </button>
                        <button
                            className="btn btn-dark btn-sm"
                            disabled={currentPage >= totalPages}
                            onClick={() => goToPage(currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}