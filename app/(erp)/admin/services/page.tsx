// app/(erp)/admin/services/page.tsx
import { CATEGORY_META, SERVICES } from "@/lib/config/services";

export default function AdminServicesPage() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-gold">Services</h1>
                <p className="text-muted text-sm mt-1">
                    Total {SERVICES.length} services across {CATEGORY_META.length}{" "}
                    categories. Ye public website ki Services pages pe display hoti hain.
                </p>
            </div>

            <div className="card mb-6" style={{ background: "rgba(201,168,76,0.05)" }}>
                <p className="text-sm text-muted">
                    ℹ️ Services abhi static config file (
                    <code className="code">lib/config/services.ts</code>) se manage hoti
                    hain. Naya service add/edit karne ke liye developer se contact
                    karein, ya future update me isse database-driven banaya ja sakta
                    hai.
                </p>
            </div>

            {CATEGORY_META.map((category) => {
                const categoryServices = SERVICES.filter(
                    (s) => s.category === category.category
                );

                return (
                    <div key={category.slug} className="table-container mb-6">
                        <div className="table-header">
                            <span className="table-title">
                                {category.icon} {category.title} ({categoryServices.length})
                            </span>
                        </div>
                        {categoryServices.length === 0 ? (
                            <div className="p-6 text-center text-muted text-sm">
                                Is category me abhi koi service nahi hai.
                            </div>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Service</th>
                                        <th>Starting Price</th>
                                        <th>Features</th>
                                        <th>Popular</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categoryServices.map((service) => (
                                        <tr key={service.id}>
                                            <td>
                                                <span style={{ marginRight: "8px" }}>
                                                    {service.icon}
                                                </span>
                                                <span className="font-medium">{service.title}</span>
                                                <div className="text-xs text-muted mt-1">
                                                    {service.description}
                                                </div>
                                            </td>
                                            <td>
                                                {service.priceStarting
                                                    ? `₹${service.priceStarting} / ${service.priceUnit || "unit"}`
                                                    : "—"}
                                            </td>
                                            <td>
                                                <div className="flex flex-wrap gap-2">
                                                    {service.features.map((f) => (
                                                        <span key={f} className="badge badge-gray">
                                                            {f}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>
                                                {service.isPopular ? (
                                                    <span className="badge badge-gold">⭐ Popular</span>
                                                ) : (
                                                    "—"
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                );
            })}
        </div>
    );
}