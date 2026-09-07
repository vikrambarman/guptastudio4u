// app/(public)/gallery/page.tsx
import type { Metadata } from "next";
import connectDB from "@/lib/db/mongodb";
import { getPublicGalleryMedia } from "@/lib/db/queries/publicQueries";
import SectionHeading from "@/components/public/SectionHeading";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Hamare kuch selected shoots ki jhalak dekhein.",
};

export default async function GalleryPage() {
  await connectDB();
  const photos = await getPublicGalleryMedia();

  return (
    <div className="public-page section">
      <div className="container">
        <SectionHeading
          label="Our Work"
          title="Gallery"
          description="Hamare kuch chuninda shoots ki jhalak"
        />

        {photos.length === 0 ? (
          <p className="text-center text-muted">
            Gallery jald hi update hogi. Tab tak hamari services dekhein.
          </p>
        ) : (
          <div className="gallery-masonry">
            {photos.map((photo) => (
              <div key={photo.mediaId} className="gallery-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt="Gupta Studio 4u work sample" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}