// app/(erp)/admin/gallery/page.tsx
import connectDB from "@/lib/db/mongodb";
import { getAllPublicMedia } from "@/lib/db/queries/mediaQueries";
import PublicGalleryGrid from "@/components/erp/admin/PublicGalleryGrid";

export default async function AdminGalleryPage() {
    await connectDB();
    const media = await getAllPublicMedia();

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-gold">Public Gallery</h1>
                <p className="text-muted text-sm mt-1">
                    Ye photos public website ki Gallery page pe visible hain ({media.length}{" "}
                    total). Kisi event ke media manager se photos ko public/private mark
                    kar sakte hain.
                </p>
            </div>

            <div className="table-container">
                <div style={{ padding: "var(--space-6)" }}>
                    <PublicGalleryGrid media={JSON.parse(JSON.stringify(media))} />
                </div>
            </div>
        </div>
    );
}