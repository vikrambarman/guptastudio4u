// app/(erp)/admin/clients/page.tsx
import Link from "next/link";
import connectDB from "@/lib/db/mongodb";
import { getClientsList } from "@/lib/db/queries/clientQueries";
import ClientTable from "@/components/erp/admin/ClientTable";

interface PageProps {
    searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function ClientsListPage({ searchParams }: PageProps) {
    const { search = "", page = "1" } = await searchParams;
    const currentPage = parseInt(page, 10) || 1;

    await connectDB();
    const { clients, total, totalPages } = await getClientsList({
        search,
        page: currentPage,
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-gold">Clients</h1>
                    <p className="text-muted text-sm mt-1">
                        Total {total} client{total !== 1 ? "s" : ""} registered
                    </p>
                </div>
                <Link href="/admin/clients/new" className="btn btn-gold">
                    + Register New Client
                </Link>
            </div>

            <ClientTable
                clients={JSON.parse(JSON.stringify(clients))}
                search={search}
                currentPage={currentPage}
                totalPages={totalPages}
            />
        </div>
    );
}