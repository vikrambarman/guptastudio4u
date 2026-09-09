// app/(erp)/admin/orders/page.tsx
import connectDB from "@/lib/db/mongodb";
import { getOrdersList } from "@/lib/db/queries/orderQueries";
import OrderTable from "@/components/erp/admin/OrderTable";

interface PageProps {
    searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}

export default async function OrdersListPage({ searchParams }: PageProps) {
    const { search = "", status = "", page = "1" } = await searchParams;
    const currentPage = parseInt(page, 10) || 1;

    await connectDB();
    const { orders, total, totalPages } = await getOrdersList({
        search,
        status,
        page: currentPage,
    });

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-gold">Orders</h1>
                <p className="text-muted text-sm mt-1">
                    Total {total} order{total !== 1 ? "s" : ""} (album/print requests)
                </p>
            </div>

            <OrderTable
                orders={JSON.parse(JSON.stringify(orders))}
                search={search}
                status={status}
                currentPage={currentPage}
                totalPages={totalPages}
            />
        </div>
    );
}