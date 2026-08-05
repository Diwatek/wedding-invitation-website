import Image from "next/image";
import { imagePath, type ImageSceneSlug } from "@/data/wedding";

export function GalleryGrid({
  title,
  items,
}: {
  title?: string;
  items: { slug: ImageSceneSlug; alt: string; label: string }[];
}) {
  return (
    <section className="section-block">
      {title ? <h2>{title}</h2> : null}
      <div className="gallery-grid">
        {items.map((item) => (
          <figure key={item.slug}>
            <div className="image-frame">
              <Image
                src={imagePath(item.slug)}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <figcaption>{item.label}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
